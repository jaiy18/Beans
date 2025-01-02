import { getData, setData } from './dataStore';
import {
  Messages, Error, DataBase, User,
  DmDetails, Message, Auth, Dm, Registration, MessageWithoutReact
} from './interfaces';
import HTTPError from 'http-errors';

/**
 * Creates a Dm channel
 * @param token - user identifier
 * @param uIds - array of users dm is directed to
 * @returns dmId
 */
export function dmCreateV1(token: string, uIds: Array<number>): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex(u => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token invalid');
  // Error checking

  for (const elem of uIds) {
    const validUser: Registration = data.users.find(u => u.authUserId === elem);
    if (!validUser) {
      throw HTTPError(403, 'uId(s) in list is not valid');
    }
  }

  let duplicates = 0;
  const duplicateObj: object = {};

  for (const elem of uIds) {
    if (!duplicateObj[elem]) {
      duplicateObj[elem] = 1;
    } else {
      duplicateObj[elem] = duplicateObj[elem] + 1;
      if (duplicateObj[elem] === 2) {
        duplicates++;
        duplicateObj[elem] = 0;
      }
    }
  }

  if (duplicates > 0) {
    throw HTTPError(400, 'Duplicate uId in list');
  }

  // Generate dmId
  const dmId: number = data.dms.length;
  const allMembers = [data.users[userIndex].authUserId];
  const ArrNames: string[] = [data.users[userIndex].handleStr];
  for (const user of uIds) {
    const tracker = data.users.findIndex(a => a.authUserId === user);
    allMembers.push(data.users[tracker].authUserId);
    ArrNames.push(data.users[tracker].handleStr);
  }

  ArrNames.sort();
  const names = ArrNames.join(', ');
  const newDm: Dm = {
    dmId: dmId,
    name: names,
    ownerMembers: [data.users[userIndex].authUserId],
    allMembers: allMembers,
    messages: []
  };

  const owner = data.users.find(u => u.token === token);
  for (const uId of allMembers) {
    const member = data.users.find(u => u.authUserId === uId);
    member.notifications.unshift({
      channelId: -1,
      dmId: dmId,
      notificationMessage: `${owner.handleStr} added you to ${names}`
    });
  }

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);
  for (const uId of allMembers) {
    const userStats = data.userStats.find(i => i.uId === uId);
    const dmsJoined = userStats.dmsJoined[userStats.dmsJoined.length - 1].numDmsJoined + 1;

    userStats.dmsJoined.push({ numDmsJoined: dmsJoined, timeStamp: timeStamp });
  }
  data.dms.push(newDm);
  const numDmsExist = data.dms.length;
  data.workspaceStats.dmsExist.push({ numDmsExist: numDmsExist, timeStamp: timeStamp });
  setData(data);

  return { dmId };
}

/**
 * For a valid token, returns information about all
 * the dms the user is in
 * @param {token} - the user making the call
 * @returns {dms} - array of objects with dms the user is in
*/

export function dmListV1(token: string): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const member: number = data.users.findIndex(m => m.token === token);
  const dms = [];
  // Error checking
  if (member < 0) {
    throw HTTPError(403, 'Token is invalid');
  }
  // checking the dms user is
  for (const dm of data.dms) {
    for (const name of dm.allMembers) {
      if (data.users[member].authUserId === name) {
        // pushs dm to new array
        const newDm = {
          dmId: dm.dmId,
          name: dm.name
        };
        dms.push(newDm);
      }
    }
  }
  setData(data);
  return { dms };
}
/**
* Given a DM with ID dmId that the authorised user is a member of,
* provide basic details about the DM.
*
* @param {token} string - random string used to identify specific user session
* @param {dmId} number - number associated to the specific dm group
* @returns {name} - string listing names of all participants in the dm. Names are separated
*                   by a comma and space.
* @returns {members} - Array of objects, where each object contains types of user. User is an
                     object containing uId, email, nameFirst, nameLast, handleStr
*
*/
export function dmDetailsV1(token: string, dmId: number): Error | DmDetails {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex((u: Auth) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const dmIndex: number = data.dms.findIndex((d) => d.dmId === dmId);
  if (dmIndex < 0) throw HTTPError(400, 'dmId is invalid');

  const inDm: boolean = data.dms[dmIndex].allMembers.some((m) => m === authUserId);
  if (!inDm) throw HTTPError(403, 'User is not a member of the dm');

  const members: User[] = [];
  for (const member of data.dms[dmIndex].allMembers) {
    members[member] = {
      uId: data.users[member].authUserId,
      email: data.users[member].email,
      nameFirst: data.users[member].nameFirst,
      nameLast: data.users[member].nameLast,
      handleStr: data.users[member].handleStr
    };
  }
  setData(data);
  return {
    name: data.dms[dmIndex].name,
    members: members
  };
}

/**
 * For a valid token and valid dmId, removes user from
 * given dm
 * @param {token} - the user making the call
 * @param {dmId} - dmId to be removed from
 * @returns {}
*/

export function dmRemoveV1(token: string, dmId: number): object | Error {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex((u: Auth) => u.token === token);
  if (userIndex < 0) {
    throw HTTPError(403, 'Token is invalid');
  }

  const dmIndex: number = data.dms.findIndex((d) => d.dmId === dmId);
  if (dmIndex < 0) {
    throw HTTPError(400, 'dmId is invalid');
  }
  // Checks if the user is in owner/all members
  const userId = data.users[userIndex].authUserId;

  const findIfMember = data.dms[dmIndex].allMembers.find((u) => u === userId);
  if (findIfMember === undefined) {
    throw HTTPError(403, 'the user is no longer in the DM');
  }

  const findIfOwner = data.dms[dmIndex].ownerMembers.find((u) => u === userId);
  if (findIfOwner === undefined) {
    throw HTTPError(403, 'the user is not the original DM creator');
  }

  const uIds = data.dms[dmIndex].allMembers;
  // removes the user
  data.dms.splice(dmIndex, 1);

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);
  for (const uId of uIds) {
    const userStats = data.userStats.find(i => i.uId === uId);
    const dmsJoined = userStats.dmsJoined[userStats.dmsJoined.length - 1].numDmsJoined - 1;
    userStats.dmsJoined.push({ numDmsJoined: dmsJoined, timeStamp: timeStamp });
  }
  const numDmsExist = data.workspaceStats.dmsExist[data.workspaceStats.dmsExist.length - 1].numDmsExist - 1;
  data.workspaceStats.dmsExist.push({ numDmsExist: numDmsExist, timeStamp: timeStamp });

  let totalMsgs = 0;
  for (const channel of data.channels) {
    totalMsgs += channel.messages.length;
  }
  for (const dm of data.dms) {
    totalMsgs += dm.messages.length;
  }
  data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: timeStamp });
  console.log(data.workspaceStats.messagesExist);

  setData(data);
  return {};
}
/**
 * Given a DM ID, the user is removed as a member of this DM.
 * @param token - user identifier
 * @param dmId - dm identifier
 * @returns {}
 */

export function dmLeaveV1(token: string, dmId: number): Error | object {
  const data: DataBase = getData();
  if (token.length < 7) {
    const hash = require('object-hash');
    token = hash({ string: token });
  }
  const user = data.users.findIndex((u: Auth) => u.token === token);
  if (user < 0) throw HTTPError(403, 'Token is invalid dm Leave');
  const authUserId: number = data.users[user].authUserId;

  const dm = data.dms.findIndex(d => d.dmId === dmId);
  if (dm < 0) throw HTTPError(400, 'dmId is invalid');

  const inDm: boolean = data.dms[dm].allMembers.some((m) => m === authUserId);
  if (!inDm) throw HTTPError(403, 'User is not valid');

  const indexMember: number = data.dms[dm].allMembers
    .findIndex((u) => u === authUserId);
  data.dms[dm].allMembers.splice(indexMember, 1);

  const indexOwner: number = data.dms[dm].ownerMembers
    .findIndex((u) => u === authUserId);
  if (indexOwner >= 0) {
    data.dms[dm].ownerMembers.splice(indexOwner, 1);
  }

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);

  const userStats = data.userStats.find(i => i.uId === authUserId);
  const dmsJoined = userStats.dmsJoined[userStats.dmsJoined.length - 1].numDmsJoined - 1;

  userStats.dmsJoined.push({ numDmsJoined: dmsJoined, timeStamp: timeStamp });

  setData(data);
  return {};
}

/**
 * Given a DM with ID dmId that the authorised user is a member of,
 * return up to 50 messages between index "start" and "start + 50".
 * Message with *index 0 is the most recent message in the DM.
 * This function returns a new index "end" which is the value of "start + 50", or,
 * if this function has *returned the least recent messages in the DM,
 * returns -1 in "end" to indicate there are no more messages to load after this return.
 * @param { token } string - Id of the person calling the function
 * @param {dmId} number - Id of the dm
 * @param {start} number - the start index of the messages to be listed
 * @returns { }
 */

export function dmMessagesV1 (token: string, dmId: number, start: number): Error | Messages {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const dmIndex: number = data.dms.findIndex((d) => d.dmId === dmId);
  if (dmIndex < 0) throw HTTPError(400, 'dmId is invalid');

  const userIndex: number = data.users.findIndex((u) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const inDm: boolean = data.dms[dmIndex].allMembers.includes(authUserId);
  if (!inDm) throw HTTPError(403, 'user is not a member of the DM');

  const numberOfMessages: number = data.dms[dmIndex].messages.length;

  if (start > numberOfMessages) {
    throw HTTPError(400, 'start parameter is greater than number of messages in the DM');
  }
  let end: number;
  if (numberOfMessages > start + 50) {
    end = start + 50;
  } else if (numberOfMessages === 0 || numberOfMessages <= start + 50) {
    end = -1;
  }
  const reversed: Message[] = data.dms[dmIndex].messages.slice().reverse();
  const messages: MessageWithoutReact[] =
    reversed.slice(start, start + 50)
      .map(m => ({
        messageId: m.messageId,
        uId: m.uId,
        message: m.message,
        timeSent: m.timeSent
      }));
  setData(data);
  return { messages, end, start };
}
