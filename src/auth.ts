import { getData, setData } from './dataStore';
import validator from 'validator';
import { Error, DataBase, Auth, Reset, userStat, Registration } from './interfaces';
import { emailSendCode } from './emailSend';
import HTTPError from 'http-errors';
import { url, port } from './config.json';
const DEFAULT_IMG_DIR = `${url}:${port}/ProfilePictures/DefaultProfileImg.jpg`;

// Given a registered user's email and password,
// returns their authUserId value.
/**
 * @param {String} email - Email belonging to user
 * @param {String} password - String containing at least 6 characters, used to verify user
 * @returns {Number} authUserId - Returns the authUserId if the user is valid, ie. password and email match
*/

export function authLoginV1(email: string, password: string): Error | Auth {
  const hash = require('object-hash');
  password = hash({ passwordStr: password });
  const data: DataBase = getData();
  // Check that email belongs to a user
  const emailInUse: boolean = data.users.some((u) => u.email.includes(email));
  if (!emailInUse) {
    throw HTTPError(403, 'Email does not belong to user');
  }
  // Check that password is correct
  const index: number = data.users.findIndex((u) => u.email === email);
  if (password !== data.users[index].password) {
    throw HTTPError(400, 'Password incorrect');
  }

  // Gemerate a random token
  let unhashedToken = '';
  let token = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  for (let i = 0; i < 6; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
    unhashedToken = token;
  }
  data.users[index].token = hash({ string: token });
  return {
    authUserId: data.users[index].authUserId,
    token: unhashedToken
  };
}

// Given a user's first and last name, email address, and password,
// creates a new account for them and returns a new authUserId.
/*
@param {String} email - Email belonging to user
@param {String} password - String containing at least 6 characters, used to verify user
@param {String} nameFirst - First name of user
@param {String} nameLast - Last name of user
============================================================================================
@returns {Number} authUserId - Generates the unique integer value for each registered user
*/
export function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string): Error | Auth {
  const data: DataBase = getData();
  const hash = require('object-hash');
  // Checking for correct variables ie. name, last name, password, email
  if (password.length < 6) {
    throw HTTPError(400, 'Password less than 6 characters');
  } else if (validator.isEmail(email) === false) {
    throw HTTPError(403, 'Email not valid');
  } else if ((nameFirst.length < 1) || (nameFirst.length > 50)) {
    throw HTTPError(400, 'First name invalid length');
  } else if ((nameLast.length < 1) || (nameLast.length > 50)) {
    throw HTTPError(400, 'Last name invalid length');
  } else {
    // Searching if email is already in use
    const emailInUse: object = data.users.find(u => u.email === email);

    if (emailInUse) {
      throw HTTPError(403, 'Email already in use');
    }

    // Creating handleStr by joining first name and last name
    const nameFirstLower: string = nameFirst.toLowerCase();
    const nameLastLower: string = nameLast.toLowerCase();
    let handleStr: string = nameFirstLower.concat(nameLastLower);

    // Only keeps first 20 characters of handleStr
    if (handleStr.length > 20) {
      handleStr = handleStr.substring(0, 20);
    }
    const initialLength: number = handleStr.length;
    let count = -1;

    // Searching for duplicate handleStrs in data.users, if found, append an integer
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].handleStr === handleStr) {
        count = count + 1;
        handleStr = handleStr + count;
        handleStr = handleStr.substring(0, initialLength) + handleStr[handleStr.length - 1];
      }
    }
    handleStr = handleStr.replace(/[ .,@/#!$%^&*;:{}=\-_`~()]/g, '');
    // Generate unique authUserId
    const authUserId: number = data.users.length;

    // Gemerate a random token
    let unhashedToken = '';
    let token = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength: number = characters.length;
    for (let i = 0; i < 6; i++) {
      token += characters.charAt(Math.floor(Math.random() * charactersLength));
      unhashedToken = token;
    }
    const hashedToken = hash({ string: token });

    // console.log(`the unhashed token is ${unhashedToken}`)

    const newRegistration: Registration = {
      authUserId: authUserId,
      email: email,
      password: hash({ passwordStr: password }),
      nameFirst: nameFirst,
      nameLast: nameLast,
      handleStr: handleStr,
      token: hashedToken,
      permission: 2,
      notifications: [],
      profileImgUrl: DEFAULT_IMG_DIR
    };

    if (authUserId === 0) {
      newRegistration.permission = 1;
    }

    const time = Math.floor(Date.now() / 1000);
    // userStats
    const userStats: userStat = {
      uId: authUserId,
      channelsJoined: [{ numChannelsJoined: 0, timeStamp: time }],
      dmsJoined: [{ numDmsJoined: 0, timeStamp: time }],
      messagesSent: [{ numMessagesSent: 0, timeStamp: time }],
      involvementRate: 0
    };
    data.userStats.push(userStats);
    // Workspace Stats
    if (newRegistration.permission === 1) {
      const workspaceStats = {
        channelsExist: [{ numChannelsExist: 0, timeStamp: time }],
        dmsExist: [{ numDmsExist: 0, timeStamp: time }],
        messagesExist: [{ numMessagesExist: 0, timeStamp: time }],
        utilizationRate: 0
      };
      data.workspaceStats = workspaceStats;
    }
    data.users.push(newRegistration);
    setData(data);
    return {
      authUserId: authUserId,
      token: unhashedToken
    };
  }
}

/**
 * Given a channel with ID channelId that the authorised user is a member of,
 * remove them as a member of the channel. Their messages should remain in the channel.
 * If the only channel owner leaves, the channel will remain.
 * @param { token } string - Id of the person calling the function
 * @param {channelId} number - Id of the channel
 * @returns {}
 */
export function authLogoutV1(token: string): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex(u => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'token is invalid');
  delete data.users[userIndex].token;

  setData(data);
  console.log(data.users[userIndex].token);
  return {};
}

/**
 * Sends an email to user with resetCode
 * @param email - email of the user
 * @returns {}
 */

export function authPasswordResetRequestV1(email: string): Error | object {
  const data: DataBase = getData();
  const userIndex: number = data.users.findIndex(u => u.email === email);
  if (userIndex < 0) return {};

  delete data.users[userIndex].token;

  let code = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const reset: Reset = {
    resetCode: code,
    email: email,
  };
  data.resetCodes.push(reset);
  setData(data);
  emailSendCode(email, code);
  return {};
}

/**
 * Resets the users password
 * @param resetCode - reset code sent to email
 * @param newPassword - newPassword to be set for the users
 * @returns {}
 */

export function authPasswordResetResetV1(resetCode: string, newPassword: string): Error | object {
  const hash = require('object-hash');
  const data: DataBase = getData();
  if (newPassword.length < 6) throw HTTPError(400, 'password too short');
  const code: number = data.resetCodes.findIndex(u => u.resetCode === resetCode);
  if (code < 0) throw HTTPError(400, 'resetCode is invalid');
  const userIndex = data.users.findIndex(u => u.email === data.resetCodes[code].email);

  data.users[userIndex].password = hash({ passwordStr: newPassword });
  data.resetCodes.splice(data.resetCodes.findIndex(pass => pass.resetCode === resetCode));
  setData(data);
  return {};
}
