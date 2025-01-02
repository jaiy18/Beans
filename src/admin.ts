import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

/**
 *
 * @param token - user calling the function
 * @param uId - the user being removed
 * @returns {}
 */
export function adminUserRemoveV1(token: string, uId: number) {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  // token invalid
  const authUserIndex: number = data.users.findIndex((u) => u.token === token);
  if (authUserIndex < 0) throw HTTPError(403, 'Token is invalid admin');

  const uIdIndex: number = data.users.findIndex((u) => u.authUserId === uId);
  if (uIdIndex < 0) throw HTTPError(400, 'uId is invalid');

  if (data.users[authUserIndex].permission !== 1) {
    throw HTTPError(403, 'the authorised user is not a global owner');
  }

  const uIdIsGlobal: boolean = data.users[uIdIndex].permission === 1;
  let numGlobals = 0;
  for (const user of data.users) {
    if (user.permission === 1) {
      numGlobals++;
    }
  }

  if (uIdIsGlobal && numGlobals === 1) {
    throw HTTPError(400, 'uId refers to a user who is the only global owner');
  }

  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.uId === uId) {
        message.message = 'Removed user';
        setData(data);
      }
    }
  }

  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.uId === uId) {
        message.message = 'Removed user';
        setData(data);
      }
    }
  }
  for (const channel of data.channels) {
    const indexOwner: number = channel.ownerMembers.findIndex((u) => u.uId === uId);
    if (indexOwner >= 0) {
      channel.ownerMembers.splice(indexOwner, 1);
      setData(data);
    }

    const indexMember: number = channel.allMembers.findIndex((u) => u.uId === uId);
    if (indexMember >= 0) {
      channel.allMembers.splice(indexMember, 1);
      setData(data);
    }
  }

  for (const dm of data.dms) {
    const indexMember: number = dm.allMembers.findIndex((u) => u === uId);
    if (indexMember >= 0) {
      dm.allMembers.splice(indexMember, 1);
      setData(data);
    }

    const indexOwner: number = dm.ownerMembers.findIndex((u) => u === uId);
    if (indexOwner >= 0) {
      dm.ownerMembers.splice(indexOwner, 1);
      setData(data);
    }
  }

  data.users[uIdIndex].email = '';
  data.users[uIdIndex].handleStr = '';
  data.users[uIdIndex].nameFirst = 'Removed';
  data.users[uIdIndex].nameLast = 'user';
  delete data.users[uIdIndex].token;

  setData(data);
  return {};
}

export function adminUserPermissionChangeV1(token: string, uId: number, permissionId: number) {
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  // token invalid
  const authUserIndex: number = data.users.findIndex((u) => u.token === token);
  if (authUserIndex < 0) throw HTTPError(403, 'Token is invalid');

  const userIndex: number = data.users.findIndex((u) => u.authUserId === uId);
  if (userIndex < 0) throw HTTPError(400, 'uId is invalid');
  // const uIdToken: string = data.users[uIdIndex].token;

  if (data.users[authUserIndex].permission !== 1) {
    throw HTTPError(403, 'the authorised user is not a global owner');
  }

  let count = 0;
  for (const elem of data.users) {
    if (elem.permission === 1) {
      count++;
    }
  }
  if (count <= 1) {
    const ownerIndex: number = data.users.findIndex((u) => u.permission === 1);
    if (uId === data.users[ownerIndex].authUserId) throw HTTPError(400, 'This uId refers to the only global owner, cannot remove');
  }
  if (permissionId < 1 || permissionId > 2) throw HTTPError(400, 'permissionId is invalid');
  if (permissionId === data.users[userIndex].permission) throw HTTPError(400, 'User already has this permission');

  data.users[userIndex].permission = permissionId;
  setData(data);
  return {};
}
