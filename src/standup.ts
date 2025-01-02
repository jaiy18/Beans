import { getData, setData } from './dataStore';
import { DataBase, Auth, Channel, User, MessageCreate } from './interfaces';
import HTTPError from 'http-errors';

/**
 * For a given channel, starts a standup period lasting 'length' seconds.
 *
 * @param {token} string - random string used to identify specific user session
 * @param {channelId} number - number: channel identifier
 * @param {length} number - how long standup is active for in seconds
 *
 * @returns {timeFinish} number - exact time the standup finishes in seconds
 */
export function standupStartV1(token: string, channelId: number, length: number) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const userIndex: number = data.users.findIndex((u: Auth) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const channelIndex: number = data.channels.findIndex((c: Channel) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'ChannelId is not valid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m: User) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'User is not in the channel');

  if (length < 0) throw HTTPError(400, 'length is negative');

  if (data.channels[channelIndex].standupActive === true) throw HTTPError(400, 'standup already active');

  data.channels[channelIndex].standupActive = true;
  data.channels[channelIndex].standupStarterId = authUserId;
  const timeOfFinish = Math.floor(Date.now() / 1000) + length;
  data.channels[channelIndex].standupTimeFinish = timeOfFinish;
  setTimeout(() => {
    const data = getData();
    const messageId: number = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 10001);
    const bufferedMessage: MessageCreate = {
      messageId: messageId,
      uId: authUserId,
      message: data.channels[channelIndex].standupMessage,
      timeSent: timeOfFinish,
      reacts: [],
      isPinned: false
    };
    data.channels[channelIndex].messages.push(bufferedMessage);
    data.channels[channelIndex].standupMessage = '';
    data.channels[channelIndex].standupActive = false;
    data.channels[channelIndex].standupTimeFinish = null;
    data.channels[channelIndex].standupStarterId = -1;
    setData(data);
  }, length * 1000);

  setData(data);
  return { timeFinish: timeOfFinish };
}

/**
 * For a given channel, returns whether a standup is active in it, and what time the standup finishes.
 *
 * @param {token} string - random string used to identify specific user session
 * @param {channelId} number - number: channel identifier
 *
 * @returns {isActove} boolean - returns true/false depending if the channel has an active standup
 * @returns {timeFinish} number - exact time the standup finishes in seconds
 */
export function standupActiveV1(token: string, channelId: number) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });

  const userIndex: number = data.users.findIndex((u: Auth) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const channelIndex: number = data.channels.findIndex((c: Channel) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'ChannelId is not valid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m: User) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'User is not in the channel');

  let isActive = false;
  let timeFinish = null;
  if (data.channels[channelIndex].standupActive === true) {
    isActive = true;
    timeFinish = data.channels[channelIndex].standupTimeFinish;
  }
  const object = {
    isActive: isActive,
    timeFinish: timeFinish
  };
  setData(data);
  return object;
}

/**
 * For a given channel, if a standup is currently active in the channel, sends a message to get buffered in the standup queue.
 *
 * @param {token} string - random string used to identify specific user session
 * @param {channelId} number - number: channel identifier
 * @param {message} string - message sent to the standup during buffer
 *
 * @returns {}
 */
export function standupSendV1(token: string, channelId: number, message: string) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });

  const userIndex: number = data.users.findIndex((u: Auth) => u.token === token);
  if (userIndex < 0) throw HTTPError(403, 'Token is invalid');
  const authUserId: number = data.users[userIndex].authUserId;

  const channelIndex: number = data.channels.findIndex((c: Channel) => c.channelId === channelId);
  if (channelIndex < 0) throw HTTPError(400, 'ChannelId is not valid');

  const inChannel: boolean = data.channels[channelIndex].allMembers.some((m: User) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'User is not in the channel');

  if (message.length > 1000) throw HTTPError(400, 'message length over 1000 characters');

  if (data.channels[channelIndex].standupActive === false) throw HTTPError(400, 'no standup active');

  const messageString = `${data.users[userIndex].handleStr}: ${message}\n`;
  data.channels[channelIndex].standupMessage += messageString;
  setData(data);
  return {};
}
