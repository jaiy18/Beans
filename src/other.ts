import { setData, getData } from './dataStore';
import { DataBase } from './interfaces';
import HTTPError from 'http-errors';
import fs from 'fs';
const path = require('path');
import { PROFILE_PHOTO_DIR } from './users';
// Resets the internal data of the application to its initial state
export function clearV1(): object {
  const data: DataBase = {
    users: [],
    channels: [],
    dms: [],
    resetCodes: [],
    userStats: [],
    workspaceStats: {
      channelsExist: [],
      dmsExist: [],
      messagesExist: [],
      utilizationRate: 0
    }
  };
  fs.readdir(PROFILE_PHOTO_DIR, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(PROFILE_PHOTO_DIR, file), (err) => {
        if (err) throw err;
      });
    }
  });
  setData(data);
  return {};
}

/**
 * Gets the 20 most recent notifications of the user
 * @param token - the user calling the function
 * @returns {notifications}
 */

export function notificationsGetV1 (token: string) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const valid = data.users.find(u => u.token === token);
  if (valid === undefined) throw HTTPError(403, 'Token is not valid');
  const notifications = valid.notifications;

  return { notifications: notifications.slice(0, 20) };
}
