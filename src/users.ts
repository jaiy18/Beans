import { getData, setData } from './dataStore';
import { UsersAll, Error, UserObj, DataBase, Stats, workSpaceStats } from './interfaces';
import { port, url } from './config.json';
import request from 'sync-request';
import validator from 'validator';
import HTTPError from 'http-errors';
import Jimp from 'jimp';
import fs from 'fs';
export const PROFILE_PHOTO_DIR = 'ProfilePictures/UserProfilePic/';
export const TEMP_PROFILE_DIR = 'ProfilePictures/TempProfileDir/';

/**
 * For a valid user, returns information about their user ID, email,
 * first name, last name, and handle
 * @param {authUserId} - the user making the call
 * @param {uId} - the profile being returned
 * @returns {uId, email, nameFirst, nameLast, handleStr}
*/

export function userProfileV1(token: string, uId: number): Error | UserObj {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'token is invalid');

  const uIdIndex: number = data.users.findIndex((u) => u.authUserId === uId);
  if (uIdIndex < 0) throw HTTPError(400, 'uId is invalid');

  setData(data);
  return {
    user: {
      uId: data.users[uIdIndex].authUserId,
      email: data.users[uIdIndex].email,
      nameFirst: data.users[uIdIndex].nameFirst,
      nameLast: data.users[uIdIndex].nameLast,
      handleStr: data.users[uIdIndex].handleStr
    }
  };
}

/**
 * For a valid token, returns information about all users
 * @param {token} - the user making the call
 * @returns {users}
*/

export function usersAllV1(token: string): UsersAll | Error {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  // Checks if the token is valid
  if (!(data.users.find((u) => u.token === token))) {
    throw HTTPError(403, 'token is invalid');
  }
  // maps all information on users from data.users
  const users = data.users
    .filter(u => u.nameFirst !== 'Removed')
    .map(u => ({
      uId: u.authUserId,
      email: u.email,
      nameFirst: u.nameFirst,
      nameLast: u.nameLast,
      handleStr: u.handleStr
    }));
  setData(data);
  return { users: users };
}

/**
 * For a valid token, changes the user's first and
 * last name
 * @param {token} - the user making the call
 * @param {nameFirst} - name to be changed to
 * @param {nameLast} - name to be changed to
 * @returns {}
*/

export function userProfileSetnameV1(token: string, nameFirst: string, nameLast: string): object | Error {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const user: number = data.users.findIndex((u) => u.token === token);
  // checking if token is valid
  if (user < 0) throw HTTPError(403, 'token is invalid');
  // Checking if first and last name are valid
  if (nameFirst.length > 50 || nameFirst.length < 1) {
    throw HTTPError(400, 'nameFirst is invalid');
  }
  if (nameLast.length > 50 || nameLast.length < 1) {
    throw HTTPError(400, 'nameLast is invalid');
  }
  // changes names in database
  data.users[user].nameFirst = nameFirst;
  data.users[user].nameLast = nameLast;
  setData(data);
  return {};
}

/**
 * For a valid token, changes the user's email
 * @param {token} - the user making the call
 * @param {email} - email to be changed to
 * @returns {}
*/

export function userProfileSetemailV1(token: string, email: string): object | Error {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const user: number = data.users.findIndex((u) => u.token === token);
  const findEmail: boolean = data.users.some((u) => u.email === email);
  // checking if the token is valid
  if (user < 0) throw HTTPError(403, 'token is invalid');
  // checking if the email is valid
  if (!(validator.isEmail(email))) {
    throw HTTPError(400, 'Email is invalid');
  }
  // checks if email already in use
  if (findEmail) {
    throw HTTPError(400, 'Email is already in use');
  }
  // sets email in database
  data.users[user].email = email;
  setData(data);
  return {};
}

/**
 * For a valid token, changes the users
 * handleStr
 * @param {token} - the user making the call
 * @param {handleStr} - handleStr to be changed to
 * @returns {}
*/

export function userProfileSethandleV1(token: string, handleStr: string): object | Error {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const user: number = data.users.findIndex((u) => u.token === token);
  const findHandle: boolean = data.users.some((u) => u.handleStr === handleStr);
  // checking if token is valid
  if (user < 0) throw HTTPError(403, 'token is invalid');
  // checking if the handle is valid
  if (findHandle) throw HTTPError(400, 'Handle already in use');

  if (handleStr.length < 3 || handleStr.length > 20) {
    throw HTTPError(400, 'Handle is invalid');
  }
  const regEx = /^[0-9a-zA-Z]+$/;
  if (!(handleStr.match(regEx))) {
    throw HTTPError(400, 'Handle is invalid');
  }
  // sets in database
  data.users[user].handleStr = handleStr;
  setData(data);
  return {};
}

/**
 * Gets the stats of all of the users, the channels they joined,
 * the number of dms, and messages sent
 * @param token - the user calling the function
 * @returns {userStats}
 */

export function userStatsV1(token: string): Error | Stats {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const user = data.users.find(u => u.token === token);

  if (user === undefined) throw HTTPError(403, 'Token is invalid');
  const uId: number = user.authUserId;
  const userData = data.userStats.find(u => u.uId === uId);

  const numOfChannels: number = userData.channelsJoined[userData.channelsJoined.length - 1].numChannelsJoined;
  const numOfDms: number = userData.dmsJoined[userData.dmsJoined.length - 1].numDmsJoined;
  const numOfMessages: number = userData.messagesSent[userData.messagesSent.length - 1].numMessagesSent;
  const numerator: number = numOfChannels + numOfDms + numOfMessages;

  const totalChannels: number = data.channels.length;
  const totalDms: number = data.dms.length;
  let totalMsgs = 0;
  for (const channel of data.channels) {
    totalMsgs = channel.messages.length;
  }
  for (const dm of data.dms) {
    totalMsgs = dm.messages.length;
  }
  const denominator = totalChannels + totalDms + totalMsgs;

  let involvementRate;
  if (denominator === 0) {
    involvementRate = 0;
  } else {
    involvementRate = numerator / denominator;
  }

  if (involvementRate > 1) {
    involvementRate = 1;
  }
  userData.involvementRate = involvementRate;

  const userStates = {
    channelsJoined: userData.channelsJoined,
    dmsJoined: userData.dmsJoined,
    messagesSent: userData.messagesSent,
    involvementRate: userData.involvementRate
  };
  return { userStats: userStates };
}

/**
 * Gets the stats of the enitre beans network
 * @param token - the user calling the function
 * @returns {workspaceStats}
 */

export function usersStatsV1(token: string): Error | workSpaceStats {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const user = data.users.find(u => u.token === token);

  if (user === undefined) throw HTTPError(403, 'Token is invalid');

  const workspaceStats = data.workspaceStats;

  let numOfChannelsJoined = 0;
  let uId = -1;
  for (const user of data.users) {
    for (const channel of data.channels) {
      for (const member of channel.allMembers) {
        if (user.authUserId === member.uId) {
          numOfChannelsJoined += 1;
          uId = member.uId;
        }
      }
    }
  }
  let numOfDmsJoined = 0;
  for (const u of data.users) {
    for (const dm of data.dms) {
      for (const member of dm.allMembers) {
        if (u.authUserId === member) {
          if (u.authUserId !== uId) {
            numOfDmsJoined += 1;
          }
        }
      }
    }
  }

  const channelDmsJoined = numOfChannelsJoined + numOfDmsJoined;

  if (data.users.length === 0) {
    workspaceStats.utilizationRate = 0;
    return { workspaceStats: workspaceStats };
  } else if (channelDmsJoined / data.users.length > 1) {
    workspaceStats.utilizationRate = 1;
    return { workspaceStats: workspaceStats };
  }

  workspaceStats.utilizationRate = channelDmsJoined / data.users.length;
  setData(data);
  return { workspaceStats: workspaceStats };
}

export function userProfileUploadPhotoV1(token: string, imgUrl: string, xStart: number, yStart: number, xEnd: number, yEnd: number): Error | object {
  const sizeOf = require('image-size');
  const data = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const user = data.users.find(u => u.token === token);
  const userIndex: number = data.users.findIndex((u) => u.token === token);
  if (user === undefined) throw HTTPError(403, 'Token is invalid');
  if (!imgUrl.includes('.jpg')) {
    throw HTTPError(400, 'Image not a JPG');
  } if (xStart < 0) {
    throw HTTPError(400, 'Invalid X dimension');
  } if (yStart < 0) {
    throw HTTPError(400, 'Invalid Y dimension');
  } if (xEnd <= xStart) {
    throw HTTPError(400, 'Invalid X dimensions');
  } if (yEnd <= yStart) {
    throw HTTPError(400, 'Invalid Y dimensions');
  }

  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  for (let i = 0; i < 10; i++) {
    string += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const name = string;
  const location = `${PROFILE_PHOTO_DIR}${name}.jpg`;
  const tempLocation = `${TEMP_PROFILE_DIR}${name}.jpg`;

  let res;

  try {
    res = request('GET', imgUrl);
  } catch (err) {
    throw HTTPError(400, 'Url not valid');
  }

  const body = res.getBody();
  fs.writeFileSync(tempLocation, body, { flag: 'w' });

  const dimensions = sizeOf(tempLocation);
  fs.unlinkSync(tempLocation);

  if (xEnd > dimensions.width) {
    throw HTTPError(400, 'x dimension out of bounds');
  }

  if (yEnd > dimensions.height) {
    throw HTTPError(400, 'x dimensions out of bounds');
  }
  fs.writeFileSync(location, body, { flag: 'w' });

  Jimp.read(imgUrl)
    .then(image => {
      return image
        .crop(xStart, yStart, xEnd - xStart, yEnd - yStart)
        .write(location);
    });

  data.users[userIndex].profileImgUrl = `${url}:${port}/${location}`;
  setData(data);
  return {};
}
