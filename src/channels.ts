import { getData, setData } from './dataStore';
import { ChannelId, Error, DataBase, Auth, Channel, channelList } from './interfaces';
import HTTPError from 'http-errors';

/**
 * Creates a new channel with the given name, that is either a public or private channel.
 * The user who created it automatically joins the channel.
 *
 * @param {token} string - Id of the person calling the function
 * @param {name} string - The name of the channel
 * @param {isPublic} boolean - Whether of not the channel is public or private
 * @returns {channelId} - Number referring to the channel
 */

export function channelsCreateV1(token: string, name: string, isPublic: boolean): ChannelId | Error {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });

  console.log(`the hashed token in the function is ${token}`);

  const userIndex: number = data.users.findIndex((u: Auth) => u.token === token);
  if (userIndex < 0) {
    throw HTTPError(403, 'Token is invalid');
  }
  if (name.length < 1) {
    throw HTTPError(400, 'Channel name is too short');
  }
  if (name.length > 20) {
    throw HTTPError(400, 'Channel name is too long');
  }
  if (data.channels.some(c => c.name.includes(name))) {
    return { error: 'Channel name already exists' };
  }

  const channelId: number = data.channels.length;
  const uId: number = data.users[userIndex].authUserId;
  const email: string = data.users[userIndex].email;
  const nameFirst: string = data.users[userIndex].nameFirst;
  const nameLast: string = data.users[userIndex].nameLast;
  const handleStr: string = data.users[userIndex].handleStr;

  const newChannel: Channel = {
    channelId: channelId,
    name: name,
    isPublic: isPublic,
    allMembers: [],
    ownerMembers: [],
    messages: [],
    standupMessage: '',
    standupActive: false,
    standupTimeFinish: null,
    standupStarterId: -1
  };

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);

  const userStats = data.userStats.find(i => i.uId === uId);
  const numChannels = userStats.channelsJoined[userStats.channelsJoined.length - 1].numChannelsJoined + 1;

  userStats.channelsJoined.push({ numChannelsJoined: numChannels, timeStamp: timeStamp });

  newChannel.allMembers.push({ uId, email, nameFirst, nameLast, handleStr });
  newChannel.ownerMembers.push({ uId, email, nameFirst, nameLast, handleStr });

  data.channels.push(newChannel);

  // Workspace stats
  const numChannelsExist = data.channels.length;
  data.workspaceStats.channelsExist.push({ numChannelsExist: numChannelsExist, timeStamp: timeStamp });

  setData(data);
  return { channelId };
}
/**
 * Provides an array of all channels (and their associated details)
 * that the authorised user is part of.
 * @param {authUserId} number - Id of the person calling the function
 * @returns {channels}  - Array of objects containing the channelId and
 *                        name of all channels
 */

export function channelsListV1(token: string): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const index: number = data.users.findIndex((u: Auth) => u.token === token);
  if (index < 0) throw HTTPError(403, 'Token is invalid');

  const auth: number = data.users[index].authUserId;
  const channels: channelList[] = [];

  for (const channel of data.channels) {
    for (const member of channel.allMembers) {
      if (member.uId === auth) {
        const inChannel = {
          channelId: channel.channelId,
          name: channel.name
        };
        channels.push(inChannel);
      }
    }
  }
  return { channels };
}

/**
 * Provides an array of all channels,
 * including private channels (and their associated details)
 * @param {authUserId} number - Id of the person calling the function
 * @returns {channels}  - Array of objects containing the channelId and
 *                        name of all channels
 */

export function channelsListAllV1(token: string): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const index: number = data.users.findIndex((u: Auth) => u.token === token);
  if (index < 0) throw HTTPError(403, 'Token is invalid');

  const channels: channelList[] = data.channels
    .map(c => ({
      channelId: c.channelId,
      name: c.name,
    }));
  setData(data);
  return { channels };
}
