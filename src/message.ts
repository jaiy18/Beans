import { getData, setData } from './dataStore';
import { Error, Message, Dm, Channel, DataBase, MessageCreate, React } from './interfaces';
import HTTPError from 'http-errors';

/**
 * Send a message from the authorised user to the channel specified by channelId.
 * @param token - string: user identifier
 * @param channelId - number: channel identifier
 * @param message - string: message to send
 * @returns messageId - the message identifier
 */

export function messageSendV1(token: string, channelId: number, message: string) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  if (indexUser < 0) throw HTTPError(403, 'Token invalid');
  const authUserId: number = data.users[indexUser].authUserId;

  const indexChannel: number = data.channels.findIndex(c => c.channelId === channelId);
  if (indexChannel < 0) throw HTTPError(400, 'Invalid channelId');

  if (message.length < 1) throw HTTPError(400, 'Message cannot be empty');

  if (message.length > 1000) throw HTTPError(400, 'Message is greater than 1000 characters');

  const inChannel: boolean = data.channels[indexChannel].allMembers.some((m) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'User is not part of the channel');

  let messageId = 0;
  for (const channel of data.channels) {
    messageId += channel.messages.length * Math.floor(Math.random() * 10);
  }

  const tag = /@[a-z0-9]+/g;
  let tags: Array<string> = message.match(tag);
  let tagged = [...data.users];
  const uIds = [];
  for (const member of data.channels[channelId].allMembers) {
    uIds.push(member.uId);
  }

  if (tags !== null) {
    tags = tags.map(handle => handle.slice(1));
    tagged = tagged.filter(user => tags.includes(user.handleStr));
    for (const user of tagged) {
      if (uIds.includes(user.authUserId)) {
        const userMs = data.users.find(u => u.authUserId === user.authUserId);
        userMs.notifications.unshift({
          channelId: channelId,
          dmId: -1,
          notificationMessage: `${data.users[indexUser].handleStr} tagged you in ${data.channels[channelId].name}: ${message.slice(0, 20)}`
        });
      }
    }
  }
  const newMessage: MessageCreate = {
    messageId: messageId,
    uId: data.users[indexUser].authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
    reacts: [],
    isPinned: false
  };
  data.channels[indexChannel].messages.push(newMessage);
  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);
  const uId = data.users[indexUser].authUserId;
  const userStats = data.userStats.find(i => i.uId === uId);
  // Gets last element and add 1 to it
  const messagesSent = userStats.messagesSent[userStats.messagesSent.length - 1].numMessagesSent + 1;
  userStats.messagesSent.push({ numMessagesSent: messagesSent, timeStamp: timeStamp });

  // Workspace stats
  let totalMsgs = 0;
  for (const channel of data.channels) {
    totalMsgs += channel.messages.length;
  }
  for (const dm of data.dms) {
    totalMsgs += dm.messages.length;
  }
  data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: timeStamp });

  setData(data);

  return { messageId };
}

/**
 * Send a message from the authorised user to the dm specified by dmId.
 * @param token - user identifier
 * @param dmId - dm identifier
 * @param message - message to be sent
 * @returns messageId - message identifier
 */
export function messageSendDmV1(token: string, dmId: number, message: string) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const dm: object = data.dms.find(i => i.dmId === dmId);
  const user: object = data.users.find(i => i.token === token);
  const indexDm: number = data.dms.findIndex(u => u.dmId === dmId);
  const indexUser: number = data.users.findIndex(u => u.token === token);

  // Error checking
  if (!user) {
    throw HTTPError(403, 'Token invalid');
  }
  if (!dm) {
    throw HTTPError(403, 'dmId does not refer to a valid DM');
  }
  if (message.length > 1000) {
    throw HTTPError(400, 'length of mesage is greater than 1000 characters');
  } else if (message.length < 1) {
    throw HTTPError(400, 'length of message is less than 1 character');
  }

  let found = false;
  for (const elem of data.dms[indexDm].allMembers) {
    if (elem === data.users[indexUser].authUserId) {
      found = true;
    }
  }
  if (found === false) {
    throw HTTPError(403, 'User is not part of the DM');
  }

  // Gemerate a random messageId
  let randomNum = '';
  const characters = '0123456789';
  const charactersLength: number = characters.length;
  for (let i = 0; i < 10; i++) {
    randomNum += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  const messageId = parseInt(randomNum);

  const newMessage: MessageCreate = {
    messageId: messageId,
    uId: data.users[indexUser].authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000),
    reacts: [],
    isPinned: false
  };
  data.dms[indexDm].messages.push(newMessage);

  const use = data.users.find(u => u.token === token);

  const tag = /@[a-z0-9]+/g;
  let tags: Array<string> = message.match(tag);
  let tagged = [...data.users];

  if (tags !== null) {
    tags = tags.map(handle => handle.slice(1));
    tagged = tagged.filter(user => tags.includes(user.handleStr));
    for (const user of tagged) {
      if (data.dms[dmId].allMembers.includes(user.authUserId)) {
        console.log(user.authUserId);
        const User = data.users.find(u => u.token === token);
        User.notifications.unshift({
          channelId: -1,
          dmId: dmId,
          notificationMessage: `${use.handleStr} tagged you in ${data.dms[dmId].name}: ${message.slice(0, 20)}`
        });
      }
    }
  }

  // Analytics
  const timeStamp = Math.floor(Date.now() / 1000);
  const uId = data.users[indexUser].authUserId;
  const userStats = data.userStats.find(i => i.uId === uId);
  // Adding 1 from value of last element
  const messagesSent = userStats.messagesSent[userStats.messagesSent.length - 1].numMessagesSent + 1;
  userStats.messagesSent.push({ numMessagesSent: messagesSent, timeStamp: timeStamp });

  // Workspace stats
  let totalMsgs = 0;
  for (const channel of data.channels) {
    totalMsgs += channel.messages.length;
  }
  for (const dm of data.dms) {
    totalMsgs += dm.messages.length;
  }
  data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: timeStamp });
  setData(data);

  return { messageId };
}
/**
 * Given a message, update its text with new text.
 * If the new message is an empty string, the message is deleted.
 * @param token - user identifier
 * @param messageId - the message to be edited
 * @param message - the updated message
 * @returns
 */

export function messageEditV1 (token: string, messageId: number, message: string): Error | object {
  const data: DataBase = getData();
  if (token.length < 7) {
    const hash = require('object-hash');
    token = hash({ string: token });
  }
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'token is invalid message');
  const authUserId: number = data.users[authUser].authUserId;

  if (message.length > 1000) throw HTTPError(400, 'message is over 1000 characters');

  let messageChannel: Message;
  let messageDm: Message;
  let channelIndex: Channel;
  let dmIndex: Dm;
  const uIds = [];

  for (const channel of data.channels) {
    messageChannel = channel.messages.find((m) => m.messageId === messageId);
    if (messageChannel) {
      channelIndex = channel;
      for (const member of channel.allMembers) {
        uIds.push(member.uId);
      }
    }
  }

  for (const dm of data.dms) {
    messageDm = dm.messages.find(m => m.messageId === messageId);
    if (messageDm) {
      dmIndex = dm;
    }
  }

  if (!messageDm && !messageChannel) throw HTTPError(400, 'messageId is invalid');

  const globalOwner: boolean = data.users[authUser].permission === 1;
  if (messageDm) {
    if (messageDm.uId !== authUserId && !(dmIndex.ownerMembers.includes(authUserId)) &&
    !globalOwner) {
      throw HTTPError(403, 'user does not have owner permissions and did not send the message');
    }
    if (message === '') {
      dmIndex.messages = dmIndex.messages.filter(message => message.messageId !== messageId);
    }
    messageDm.message = message;
  }

  if (messageChannel) {
    if (messageChannel.uId !== authUserId &&
    !(channelIndex.ownerMembers.find((o) => o.uId === authUserId)) && !globalOwner) {
      throw HTTPError(403, 'user does not have owner permissions and did not send the message');
    }
    if (message === '') {
      channelIndex.messages = channelIndex.messages.filter(message => message.messageId !== messageId);
    }
    messageChannel.message = message;
  }

  const tag = /@[a-z0-9]+/g;
  let tags: Array<string> = message.match(tag);
  let tagged = [...data.users];
  if (tags !== null) {
    tags = tags.map(handle => handle.slice(1));
    tagged = tagged.filter(user => tags.includes(user.handleStr));
    for (const user of tagged) {
      if (channelIndex !== null) {
        if (uIds.includes(user.authUserId)) {
          //const use = data.users.find(u => u.authUserId === user.authUserId);
          user.notifications.unshift({
            channelId: channelIndex.channelId,
            dmId: -1,
            notificationMessage: `${data.users[authUser].handleStr} tagged you in ${channelIndex.name}: ${message.slice(0, 20)}`
          });
        }
      }
      else { (dmIndex.allMembers.includes(user.authUserId)) 
        user.notifications.unshift({
          channelId: -1,
          dmId: dmIndex.dmId,
          notificationMessage: `${data.users[authUser].handleStr} tagged you in ${dmIndex.name}: ${message.slice(0, 20)}`
        });
      }
    }
  }

  // Workspace stats
  let totalMsgs = 0;
  for (const channel of data.channels) {
    totalMsgs += channel.messages.length;
  }
  for (const dm of data.dms) {
    totalMsgs += dm.messages.length;
  }
  data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: Math.floor(Date.now() / 1000) });
  setData(data);
  return {};
}

/**
 * Given a message within a channel or DM, marks it as "pinned".
 *
 * @param {token} string - random string used to identify specific user session
 * @param {messageId} number - number associated to the specific message in dm or channel
 *
 * @returns {}
 */
export function messagePinV1(token: string, messageId: number) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  if (indexUser < 0) throw HTTPError(403, 'Token is invalid');
  const userId: number = data.users[indexUser].authUserId;

  // If message is in channel
  let validmessageIdchannel = false;
  let channelNumber = 0;
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        validmessageIdchannel = true;
      }
    }
    if (validmessageIdchannel === false) {
      channelNumber++;
    }
  }

  // If message is in dm
  let validmessageIddm = false;
  let dmNumber = 0;
  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        validmessageIddm = true;
      }
    }
    if (validmessageIddm === false) {
      dmNumber++;
    }
  }

  if (validmessageIdchannel === false && validmessageIddm === false) {
    throw HTTPError(400, 'MessageId is not valid');
  }

  // error checking for the message if in a channel
  if (validmessageIdchannel) {
    const findIfChannelMember = data.channels[channelNumber].allMembers.find((u) => u.uId === userId);
    if (findIfChannelMember === undefined) {
      throw HTTPError(400, 'user not member of channel');
    }
    const findIfChannelOwner = data.channels[channelNumber].ownerMembers.find((u) => u.uId === userId);
    if (findIfChannelOwner === undefined) {
      throw HTTPError(403, 'no permissions');
    }

    const indexMessage = data.channels[channelNumber].messages.findIndex((u) => u.messageId === messageId);
    if (data.channels[channelNumber].messages[indexMessage].isPinned === true) {
      throw HTTPError(400, 'not pinned');
    }
    data.channels[channelNumber].messages[indexMessage].isPinned = true;
  }

  // error checking for the message if in a dm
  if (validmessageIddm) {
    const findIfDmMember = data.dms[dmNumber].allMembers.find((u) => u === userId);
    if (findIfDmMember === undefined) {
      throw HTTPError(400, 'user not member of channel');
    }
    const findIfDmOwner = data.dms[dmNumber].ownerMembers.find((u) => u === userId);
    if (findIfDmOwner === undefined) {
      throw HTTPError(403, 'no permissions');
    }

    const indexMessage: number = data.dms[dmNumber].messages.findIndex((u) => u.messageId === messageId);
    if (data.dms[dmNumber].messages[indexMessage].isPinned === true) {
      throw HTTPError(400, 'already pinned');
    }
    data.dms[dmNumber].messages[indexMessage].isPinned = true;
  }
  setData(data);
  return {};
}

/**
 * Given a message within a channel or DM, marks it as "unpinned".
 *
 * @param {token} string - random string used to identify specific user session
 * @param {messageId} number - number associated to the specific message in dm or channel
 *
 * @returns {}
 */
export function messageUnpinV1(token: string, messageId: number) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  if (indexUser < 0) throw HTTPError(403, 'Token is invalid');
  const userId: number = data.users[indexUser].authUserId;

  // If message is in channel
  let validmessageIdchannel = false;
  let channelNumber = 0;
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        validmessageIdchannel = true;
      }
    }
    if (validmessageIdchannel === false) {
      channelNumber++;
    }
  }

  // If message is in dm
  let validmessageIddm = false;
  let dmNumber = 0;
  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        validmessageIddm = true;
      }
    }
    if (validmessageIddm === false) {
      dmNumber++;
    }
  }

  if (validmessageIdchannel === false && validmessageIddm === false) {
    throw HTTPError(400, 'MessageId is not valid');
  }

  // error checking for the message if in a channel
  if (validmessageIdchannel) {
    const findIfChannelMember = data.channels[channelNumber].allMembers.find((u) => u.uId === userId);
    if (findIfChannelMember === undefined) {
      throw HTTPError(400, 'user not member of channel');
    }
    const findIfChannelOwner = data.channels[channelNumber].ownerMembers.find((u) => u.uId === userId);
    if (findIfChannelOwner === undefined) {
      throw HTTPError(403, 'no permissions');
    }

    const indexMessage = data.channels[channelNumber].messages.findIndex((u) => u.messageId === messageId);
    if (data.channels[channelNumber].messages[indexMessage].isPinned === false) {
      throw HTTPError(400, 'not pinned');
    }
    data.channels[channelNumber].messages[indexMessage].isPinned = false;
  }

  // error checking for the message if in a dm
  if (validmessageIddm) {
    const findIfDmMember = data.dms[dmNumber].allMembers.find((u) => u === userId);
    if (findIfDmMember === undefined) {
      throw HTTPError(400, 'user not member of channel');
    }
    const findIfDmOwner = data.dms[dmNumber].ownerMembers.find((u) => u === userId);
    if (findIfDmOwner === undefined) {
      throw HTTPError(403, 'no permissions');
    }

    const indexMessage: number = data.dms[dmNumber].messages.findIndex((u) => u.messageId === messageId);
    if (data.dms[dmNumber].messages[indexMessage].isPinned === false) {
      throw HTTPError(400, 'not pinned');
    }
    data.dms[dmNumber].messages[indexMessage].isPinned = false;
  }
  setData(data);
  return {};
}
/**
 * Given a messageId for a message, this message is removed from the channel/DM
 *
 * @param {token} string - random string used to identify specific user session
 * @param {messageId} number - number associated to the specific message in dm or channel
 *
 * @returns {}
 */
export function messageRemoveV1(token: string, messageId: number): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  if (indexUser < 0) throw HTTPError(403, 'Token is invalid');
  const userId: number = data.users[indexUser].authUserId;

  // If message is in channel
  let validmessageIdchannel = false;
  let channelNumber = 0;
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        validmessageIdchannel = true;
      }
    }
    if (validmessageIdchannel === false) {
      channelNumber++;
    }
  }

  // If message is in dm
  let validmessageIddm = false;
  let dmNumber = 0;
  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        validmessageIddm = true;
      }
    }
    if (validmessageIddm === false) {
      dmNumber++;
    }
  }

  if (validmessageIdchannel === false && validmessageIddm === false) {
    throw HTTPError(400, 'MessageId is not valid');
  }

  // error checking for the message if in a channel
  if (validmessageIdchannel) {
    const findIfChannelMember = data.channels[channelNumber].allMembers.find((u) => u.uId === userId);
    if (findIfChannelMember === undefined) {
      throw HTTPError(400, 'user not member of channel');
    }
    const findIfChannelOwner = data.channels[channelNumber].ownerMembers.find((u) => u.uId === userId);
    if (findIfChannelOwner === undefined) {
      throw HTTPError(403, 'no permissions');
    }

    const indexMessage = data.channels[channelNumber].messages.findIndex((u) => u.messageId === messageId);
    data.channels[channelNumber].messages.splice(indexMessage, 1);
  }

  // error checking for the message if in a dm
  if (validmessageIddm) {
    const findIfDmMember = data.dms[dmNumber].allMembers.find((u) => u === userId);
    if (findIfDmMember === undefined) {
      throw HTTPError(400, 'user not member of channel');
    }
    const findIfDmOwner = data.dms[dmNumber].ownerMembers.find((u) => u === userId);
    if (findIfDmOwner === undefined) {
      throw HTTPError(403, 'no permissions');
    }
    const indexMessage: number = data.dms[dmNumber].messages.findIndex((u) => u.messageId === messageId);
    data.dms[dmNumber].messages.splice(indexMessage, 1);
  }
  // Workspace stats
  let totalMsgs = 0;
  for (const channel of data.channels) {
    totalMsgs += channel.messages.length;
  }
  for (const dm of data.dms) {
    totalMsgs += dm.messages.length;
  }
  data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: Math.floor(Date.now() / 1000) });
  setData(data);
  return {};
}
/**
 * A new message containing the contents of both the original message and the optional message
 * is sent to the channel/DM identified by the channelId/dmId
 * @param token - the user calling the function
 * @param ogMessageId - the original message ID that is to be shared
 * @param message - an optional message that can be attached to the message being shared
 * @param channelId - the channel being shared to
 * @param dmId - the dm being shared to
 * @returns {sharedMessageId}
 */
export function messageShareV1(token: string, ogMessageId: number, message: string, channelId: number, dmId: number): Error | object {
  const unhashedToken = token;
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  if (indexUser < 0) {
    throw HTTPError(403, 'Token invalid');
  }
  const authUserId: number = data.users[indexUser].authUserId;

  const indexChannelToShare: number = data.channels.findIndex((c) => c.channelId === channelId);
  const indexDmToShare: number = data.dms.findIndex((d) => d.dmId === dmId);
  if (indexChannelToShare < 0 && indexDmToShare < 0) throw HTTPError(400, 'both channelId and dmId are invalid');

  if (channelId !== -1 && dmId !== -1) throw HTTPError(400, 'neither channelId nor dmId are -1');

  if (message.length > 1000) throw HTTPError(400, 'optional message is over 1000 chars');

  let messageChannel: Message;
  let messageDm: Message;

  for (const channel of data.channels) {
    messageChannel = channel.messages.find((m) => m.messageId === ogMessageId);
    if (messageChannel) {
      if (!channel.allMembers.find((o) => o.uId === authUserId)) {
        throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
      }
    }
  }

  for (const dm of data.dms) {
    messageDm = dm.messages.find(m => m.messageId === ogMessageId);
    if (messageDm) {
      if (!dm.allMembers.includes(authUserId)) {
        throw HTTPError(400, 'ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined');
      }
    }
  }

  if (!messageChannel && !messageDm) throw HTTPError(400, 'message is not from a valid channel/DM');

  if (dmId === -1) {
    if (!data.channels[indexChannelToShare].allMembers.find((u) => u.uId === authUserId)) {
      console.log('cat');
      throw HTTPError(403, 'user is not in the DM/Channel being shared to');
    }
    const messageConcat = messageChannel.message + ' ' + message;
    const sharedMessageId = messageSendV1(unhashedToken, channelId, messageConcat);
    return { sharedMessageId: sharedMessageId.messageId };
  }

  if (channelId === -1) {
    if (!data.dms[indexDmToShare].allMembers.includes(authUserId)) {
      console.log('dog');
      throw HTTPError(403, 'user is not in the DM/Channel being shared to');
    }
    const messageChannelConcat = messageDm.message + ' ' + message;
    const sharedMessageId = messageSendDmV1(unhashedToken, dmId, messageChannelConcat);
    return { sharedMessageId: sharedMessageId.messageId };
  }
}
/**
 * Sends a message from the authorised user to the channel specified
 * by channelId automatically at a specified time in the future.
 * @param token - user calling the function
 * @param channelId - channel where the message is being sent
 * @param message - the contents of the message
 * @param timeSent - the time that the message is to be sent
 * @returns {MessageId}
 */

export function messageSendLaterV1(token: string, channelId: number, message: string, timeSent: number) {
  const timeNow = Math.floor(Date.now() / 1000);
  const hash = require('object-hash');
  token = hash({ string: token });
  const data: DataBase = getData();
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'token is invalid');
  const authUserId: number = data.users[authUser].authUserId;

  const indexChannel: number = data.channels.findIndex(c => c.channelId === channelId);
  if (indexChannel < 0) throw HTTPError(400, 'Invalid channelId');

  if (message.length < 1) throw HTTPError(400, 'Message cannot be empty');
  if (message.length > 1000) throw HTTPError(400, 'Message is greater than 1000 characters');

  const timeUntilSend: number = timeSent - timeNow;
  if (timeUntilSend < 0) throw HTTPError(400, 'time cannot be in the past');

  const inChannel: boolean = data.channels[indexChannel].allMembers.some((m) => m.uId === authUserId);
  if (!inChannel) throw HTTPError(403, 'User is not part of the channel');

  const messageId = timeNow + Math.floor(Math.random() * 10001);

  setTimeout(() => {
    const bufferedMessage: MessageCreate = {
      messageId: messageId,
      uId: authUserId,
      message: message,
      timeSent: timeSent,
      reacts: [],
      isPinned: false
    };
    data.channels[indexChannel].messages.push(bufferedMessage);
    // Workspace stats
    const totalMsgs = data.workspaceStats.messagesExist[data.workspaceStats.messagesExist.length - 1].numMessagesExist + 1;
    data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: Math.floor(Date.now() / 1000) });
    setData(data);
  }, timeUntilSend * 1000);

  setData(data);
  return { messageId: messageId };
}
/**
 * Sends a message from the authorised user to the DM specified
 * by dmId automatically at a specified time in the future.
 * @param token - the user calling the function
 * @param dmId - the dm where the message is to be sent
 * @param message - the contents of the message
 * @param timeSent - the time that the message is to be sent
 * @returns {MessageId}
 */
export function messageSendLaterDmV1(token: string, dmId: number, message: string, timeSent: number) {
  const timeNow = Math.floor(Date.now() / 1000);
  const hash = require('object-hash');
  token = hash({ string: token });
  const data: DataBase = getData();
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'token is invalid');
  const authUserId: number = data.users[authUser].authUserId;

  const indexDm: number = data.dms.findIndex(c => c.dmId === dmId);
  if (indexDm < 0) throw HTTPError(400, 'Invalid dmId');

  if (message.length < 1) throw HTTPError(400, 'Message cannot be empty');
  if (message.length > 1000) throw HTTPError(400, 'Message is greater than 1000 characters');

  const timeUntilSend: number = timeSent - timeNow;
  if (timeUntilSend < 0) throw HTTPError(400, 'time cannot be in the past');

  const inDm: boolean = data.dms[indexDm].allMembers.includes(authUserId);
  if (!inDm) throw HTTPError(403, 'User is not part of the channel');
  const messageId = timeNow + Math.floor(Math.random() * 1001);
  setTimeout(() => {
    const bufferedMessage: MessageCreate = {
      messageId: messageId,
      uId: authUserId,
      message: message,
      timeSent: timeSent,
      reacts: [],
      isPinned: false
    };
    data.dms[indexDm].messages.push(bufferedMessage);
    // Workspace stats
    const totalMsgs = data.workspaceStats.messagesExist[data.workspaceStats.messagesExist.length - 1].numMessagesExist + 1;
    data.workspaceStats.messagesExist.push({ numMessagesExist: totalMsgs, timeStamp: Math.floor(Date.now() / 1000) });
    setData(data);
  }, timeUntilSend * 1000);

  setData(data);
  return { messageId: messageId };
}

export function messageReactV1(token: string, messageId: number, reactId: number): Error | object {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  let indexChannel: number;
  let indexDm: number;
  let messageObj: any;
  let targetChannel;
  const targetMembers = [];

  for (const channel of data.channels) {
    indexChannel = channel.messages.findIndex((m) => m.messageId === messageId);
    messageObj = channel.messages.find(m => m.messageId === messageId);
    if (indexChannel !== -1) {
      targetChannel = channel;
      for (const member of channel.allMembers) {
        targetMembers.push(member.uId);
      }
      break;
    }
  }

  for (const dm of data.dms) {
    indexDm = dm.messages.findIndex(m => m.messageId === messageId);
    messageObj = dm.messages.find(m => m.messageId === messageId);
    if (indexDm !== -1) {
      break;
    }
  }

  // Error checking
  if ((indexChannel === -1) && (indexDm === -1)) {
    throw HTTPError(400, 'messageId is invalid');
  }
  if (reactId !== 1) {
    throw HTTPError(400, 'reactId is invalid');
  }

  if (indexChannel !== undefined && indexChannel !== -1) {
    const messageIndexCh: number = data.channels[indexChannel].messages.findIndex((u) => u.messageId === messageId);
    // Check if the user has already reacted to the same message
    if (data.channels[indexChannel].messages[messageIndexCh].reacts.length > 0) {
      const found: React = data.channels[indexChannel].messages[messageIndexCh].reacts.find(({ reactId }) => reactId === 1);
      if (found.uIds.find(uId => uId === data.users[indexUser].authUserId) !== undefined) {
        throw HTTPError(400, 'user has already reacted to this message');
      }
      data.channels[indexChannel].messages[messageIndexCh].reacts[0].uIds.push(data.users[indexUser].authUserId);

      if (targetMembers.includes(messageObj.uId)) {
        const reciever = data.users.find(u => u.authUserId === messageObj.uId);
        const reactor = data.users.find(u => u.token === token);
        reciever.notifications.unshift({
          channelId: targetChannel.channelId,
          dmId: -1,
          notificationMessage: `${reactor.handleStr} reacted to your message in ${targetChannel.name}`
        });
      }

      setData(data);
      return {};
    }
    // First react
    const newReact: React = {
      reactId: 1,
      uIds: [data.users[indexUser].authUserId],
      isThisUserReacted: true
    };
    data.channels[indexChannel].messages[messageId].reacts.push(newReact);
    setData(data);
    return {};
  }

  if (indexDm !== undefined && indexDm !== -1) {
    const messageIndex: number = data.dms[indexDm].messages.findIndex((u) => u.messageId === messageId);
    // Check if the user has already reacted to the same message
    if (data.dms[indexDm].messages[messageIndex].reacts.length > 0) {
      const found: React = data.dms[indexDm].messages[messageIndex].reacts.find(({ reactId }) => reactId === 1);
      if (found.uIds.find(uId => uId === data.users[indexUser].authUserId) !== undefined) {
        throw HTTPError(400, 'user has already reacted to this message');
      } else {
        data.dms[indexDm].messages[messageIndex].reacts[0].uIds.push(data.users[indexUser].authUserId);
        const reciever = data.users.find(u => u.authUserId === messageObj.uId);
        const reactor = data.users.find(u => u.token === token);
        reciever.notifications.unshift({
          channelId: -1,
          dmId: data.dms[indexDm].dmId,
          notificationMessage: `${reactor.handleStr} reacted to your message in ${data.dms[indexDm].name}`
        });
        setData(data);
        return {};
      }
    }
    // First react
    const newReact: React = {
      reactId: 1,
      uIds: [data.users[indexUser].authUserId],
      isThisUserReacted: true
    };
    data.dms[indexDm].messages[messageIndex].reacts.push(newReact);
    setData(data);
    return {};
  }
}

export function messageUnreactV1(token: string, messageId: number, reactId: number): Error | object {
  // console.log(`messageId is ${messageId}`)
  const hash = require('object-hash');
  token = hash({ string: token });
  const data: DataBase = getData();
  const indexUser: number = data.users.findIndex((u) => u.token === token);
  let indexChannel: number;
  let indexDm: number;

  for (const channel of data.channels) {
    indexChannel = channel.messages.findIndex((m) => m.messageId === messageId);
    if (indexChannel !== -1) {
      break;
    }
  }

  for (const dm of data.dms) {
    indexDm = dm.messages.findIndex(m => m.messageId === messageId);
    if (indexDm !== -1) {
      break;
    }
  }

  // Error checking
  if ((indexChannel === -1) && (indexDm === -1)) {
    console.log('cat');
    throw HTTPError(400, 'messageId is invalid');
  }
  if (reactId !== 1) {
    console.log('dog');
    throw HTTPError(400, 'reactId is invalid');
  }

  if (indexChannel !== undefined && indexChannel !== -1) {
    const messageIndexCh: number = data.channels[indexChannel].messages.findIndex((u) => u.messageId === messageId);
    // Check if the user has reacted to this message
    if (data.channels[indexChannel].messages[messageIndexCh].reacts.length > 0) {
      const found: React = data.channels[indexChannel].messages[messageIndexCh].reacts.find(({ reactId }) => reactId === 1);
      if (found.uIds.find(uId => uId === data.users[indexUser].authUserId) === undefined) {
        throw HTTPError(400, 'user has not reacted to this message');
      }
    } else {
      throw HTTPError(400, 'user has not reacted to this message');
    }

    const index: number = data.channels[indexChannel].messages[messageIndexCh].reacts[0].uIds.indexOf(data.users[indexUser].authUserId);
    data.channels[indexChannel].messages[messageIndexCh].reacts[0].uIds.splice(index, 1);
    setData(data);
    return {};
  }

  if (indexDm !== undefined && indexDm !== -1) {
    const messageIndex: number = data.dms[indexDm].messages.findIndex((u) => u.messageId === messageId);

    // Check if the user has reacted to this message
    if (data.dms[indexDm].messages[messageIndex].reacts.length > 0) {
      const found = data.dms[indexDm].messages[messageIndex].reacts.find(({ reactId }) => reactId === 1);
      if (found.uIds.find(uId => uId === data.users[indexUser].authUserId) === undefined) {
        throw HTTPError(400, 'user has not reacted to this message');
      }
    } else {
      throw HTTPError(400, 'user has not reacted to this message');
    }
    const index: number = data.dms[indexDm].messages[messageIndex].reacts[0].uIds.indexOf(data.users[indexUser].authUserId);
    data.dms[indexDm].messages[messageIndex].reacts[0].uIds.splice(index, 1);
    setData(data);
    return {};
  }
}
