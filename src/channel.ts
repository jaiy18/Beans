import { getData, setData } from './dataStore';
import { Messages, Error, Message, ChannelDetails, MessageWithoutReact } from './interfaces';
import HTTPError from 'http-errors';

/**
 * Given a channel with ID channelId that the authorised user is a member of,
 * provides basic details about the channel.
 *
 * @param {token} string - Id of the person calling the function
 * @param {channelId} number - Id of the channel
 * @returns { name: string, isPublic: boolean, ownerMembers: array<objects>, allMembers: array<objects> }
 * a number referring to the channel
 */

export function channelDetailsV1(token: string, channelId: number): ChannelDetails | Error {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex((u) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const channelIndex = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'ChannelId is not valid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'User is not in the channel');

  const channelDetails = {
    name: data.channels[channelIndex].name,
    isPublic: data.channels[channelIndex].isPublic,
    ownerMembers: data.channels[channelIndex].ownerMembers,
    allMembers: data.channels[channelIndex].allMembers
  };
  setData(data);
  return channelDetails;
}

/**
 * Given a channelId of a channel that the authorised user can join,
 * adds them to that channel.
 * @param {token} string - Id of the person calling the function
 * @param {channelId} number - The Id of the channel
 * @returns {}  - User successfully joins
 */

export function channelJoinV1(token: string, channelId: number): Error | object {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex((u) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const channelIndex: number = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'ChannelId is not valid');

  // Checks if user has global permissions
  let globalPerms = false;
  if (data.users[userIndex].authUserId === 0) {
    globalPerms = true;
  }

  // check if user is in channel
  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === authUserId);
  if (inChannel) throw HTTPError(400, 'user is already in the channel');

  // Checking if channel is private
  if (data.channels[channelIndex].isPublic === false && globalPerms === false) {
    throw HTTPError(403, 'channelId refers to a channel that is private');
  }

  const member = {
    uId: data.users[userIndex].authUserId,
    email: data.users[userIndex].email,
    nameFirst: data.users[userIndex].nameFirst,
    nameLast: data.users[userIndex].nameLast,
    handleStr: data.users[userIndex].handleStr
  };
  data.channels[channelIndex].allMembers.push(member);

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);

  const userStats = data.userStats.find(i => i.uId === authUserId);
  const numChannels = userStats.channelsJoined[userStats.channelsJoined.length - 1].numChannelsJoined + 1;

  userStats.channelsJoined.push({ numChannelsJoined: numChannels, timeStamp: timeStamp });

  setData(data);
  // return nothing if successful
  return {};
}
/**
 * Invites a user with ID uId to join a channel with ID channelId.
 * Once invited, the user is added to the channel immediately.
 * In both public and private channels, all members are able to invite users.
 *
 * @param {authUserId} number - Id of the person calling the function
 * @param {channelId} number - The name of the channel
 * @param {uId} number - Id of the person being invited to the channel
 * @returns {}
 */

export function channelInviteV1(token: string, channelId: number, uId: number): Error | object {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[authUser].authUserId;

  const channelIndex: number = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'ChannelId is not valid');

  const uIdIndex: number = data.users.findIndex((u) => u.authUserId === uId);
  if (uIdIndex < 0) throw HTTPError(400, 'uId is not valid');

  const UIdInChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === uId);
  if (UIdInChannel) throw HTTPError(400, 'uId is not a member of the channel');

  const authInChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === authUserId);
  if (!authInChannel) throw HTTPError(403, 'authUserId is not a member of the channel');

  const newMember = {
    uId: uId,
    email: data.users[uIdIndex].email,
    nameFirst: data.users[uIdIndex].nameFirst,
    nameLast: data.users[uIdIndex].nameLast,
    handleStr: data.users[uIdIndex].handleStr
  };

  data.channels[channelIndex].allMembers.push(newMember);
  const addedUser = data.users.find((u) => u.authUserId === uId);
  const owner = data.users.find(u => u.token === token);
  addedUser.notifications.push({
    channelId: channelId,
    dmId: -1,
    notificationMessage: `${owner.handleStr} added you to ${data.channels[channelIndex].name}`
  });

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);

  const userStats = data.userStats.find(i => i.uId === uId);
  const numChannels = userStats.channelsJoined[userStats.channelsJoined.length - 1].numChannelsJoined + 1;

  userStats.channelsJoined.push({ numChannelsJoined: numChannels, timeStamp: timeStamp });

  setData(data);
  return {};
}

/**
 * For a valid user and channel, returns up to 50 messages from a given start point
 * - if there are more messages after start + 50, returns an end index
 * - if there are no more messages after the call, end equals to -1 to indicate there are no new messages to load.
 * @param {authUserId} - the user making the call
 * @param {channelId} - the channel being inspected
 * @param {start} - the starting message index, inclusive
 * @returns {messages: Array<messages>, start: number, end: number}
*/

export function channelMessagesV1(token: string, channelId: number, start: number): Messages | Error {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[authUser].authUserId;

  const channelIndex: number = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'channelId is invalid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'user is not a member in the channel');

  const numberOfMessages: number = data.channels[channelIndex].messages.length;

  if (start > numberOfMessages) {
    throw HTTPError(400, 'start parameter is greater than total number of messages in the channel');
  }

  let end: number;
  if (numberOfMessages > start + 50) {
    end = start + 50;
  } else {
    end = -1;
  }
  const reversed: Message[] = data.channels[channelIndex].messages.slice().reverse();
  const messages: MessageWithoutReact[] =
  reversed.slice(start, start + 50)
    .map((m: Message) => ({
      messageId: m.messageId,
      uId: m.uId,
      message: m.message,
      timeSent: m.timeSent
    }));
  setData(data);
  return { messages, end, start };
}

/**
 * Given a channel with ID channelId that the authorised user is a member of,
 * remove them as a member of the channel. Their messages should remain in the channel.
 * If the only channel owner leaves, the channel will remain.
 * @param { token } string - Id of the person calling the function
 * @param {channelId} number - Id of the channel
 * @returns {}
 */
export function channelLeaveV1(token: string, channelId: number): Error | object {
  const data = getData();
  if (token.length < 7) {
    const hash = require('object-hash');
    token = hash({ string: token });
  }
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'Token is invalid channel leave');
  const authUserId: number = data.users[authUser].authUserId;

  const channelIndex: number = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'channelId is invalid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'user is not a member in the channel');

  if (data.channels[channelIndex].standupActive === true) {
    if (data.channels[channelIndex].standupStarterId === authUserId) {
      throw HTTPError(400, 'user is the starter of active standup');
    }
  }

  const indexOwner: number = data.channels[channelIndex].ownerMembers.findIndex((u) => u.uId === authUserId);
  if (indexOwner >= 0) {
    data.channels[channelIndex].ownerMembers.splice(indexOwner, 1);
  }

  const indexMember: number = data.channels[channelIndex].allMembers.findIndex((u) => u.uId === authUserId);
  data.channels[channelIndex].allMembers.splice(indexMember, 1);

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);

  const userStats = data.userStats.find(i => i.uId === authUserId);
  const numChannels = userStats.channelsJoined[userStats.channelsJoined.length - 1].numChannelsJoined - 1;

  userStats.channelsJoined.push({ numChannelsJoined: numChannels, timeStamp: timeStamp });

  setData(data);
  return {};
}

/**
 * Make user with user id uId an owner of the channel.
 * @param { token } string - Id of the person calling the function
 * @param {channelId} number - Id of the channel
 * @param {uId} number - Id of the user being added as owner
 * @returns {}
 */
export function channelAddOwnerV1 (token: string, channelId: number, uId: number): Error | object {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[authUser].authUserId;

  const channelIndex: number = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'channelId is not valid');

  const uIdIndex: number = data.users.findIndex((u) => u.authUserId === uId);
  if (uIdIndex < 0) throw HTTPError(400, 'uId is not valid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m) => m.uId === uId);
  if (!inChannel) throw HTTPError(400, 'user is not a member in the channel');

  const owner: boolean = data.channels[channelIndex].ownerMembers.some((o) => o.uId === uId);
  if (owner) throw HTTPError(400, 'user is already an owner in the channel');

  const ownerPerms: boolean = data.channels[channelIndex].ownerMembers.some((o) => o.uId === authUserId);
  const globalOwner: boolean = data.users[authUser].permission === 1;
  if (!ownerPerms && !globalOwner) {
    throw HTTPError(403, 'user does not have owner permissions in the channel');
  }

  data.channels[channelIndex].ownerMembers.push({
    uId: uId,
    email: data.users[uIdIndex].email,
    nameFirst: data.users[uIdIndex].nameFirst,
    nameLast: data.users[uIdIndex].nameLast,
    handleStr: data.users[uIdIndex].handleStr
  });
  setData(data);
  return {};
}
/**
 * Remove user with user id uId as an owner of the channel.
 * @param { token } string - Id of the person calling the function
 * @param {channelId} number - Id of the channel
 * @param {uId} number - Id of the user being removed as owner
 * @returns { }
 */
export function channelRemoveOwnerV1(token: string, channelId: number, uId: number): Error | object {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[authUser].authUserId;

  const channelIndex: number = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'channelId is not valid');

  const uIdIndex: number = data.users.findIndex((u) => u.authUserId === uId);
  if (uIdIndex < 0) throw HTTPError(400, 'uId is not valid');

  const owner: boolean = data.channels[channelIndex].ownerMembers.some((o) => o.uId === uId);
  if (!owner) throw HTTPError(400, 'user is not an owner in the channel');

  const ownerPerms: boolean = data.channels[channelIndex].ownerMembers.some((o) => o.uId === authUserId);
  const globalOwner: boolean = data.users[authUser].permission === 1;
  if (!ownerPerms && !globalOwner) {
    throw HTTPError(403, 'authorised user does not have owner permissions in the channel');
  }

  if (data.channels[channelIndex].ownerMembers.length === 1) {
    throw HTTPError(400, 'user is the only owner in the channel');
  }

  const indexOwner: number = data.channels[channelIndex].ownerMembers.findIndex((o) => o.uId === uId);
  data.channels[channelIndex].ownerMembers.splice(indexOwner, 1);
  setData(data);
  return {};
}
