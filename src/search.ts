import { getData } from './dataStore';
import { DataBase } from './interfaces';
import HTTPError from 'http-errors';
import { Message } from './interfaces';

/**
 * Given a query substring, returns a collection of messages in all
 * of the channels/DMs that the user has joined that contain the query.
 * @param token - string: user identifier
 * @param query - string: substring to search
 * @returns messages - array of objects that include the given queryStr
 */

export function searchV1(token: string, queryStr: string) {
  const data: DataBase = getData();
  const hash = require('object-hash');
  token = hash({ string: token });
  const authUser: number = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) throw HTTPError(403, 'token is invalid');

  if (queryStr.length > 1000 || queryStr.length < 1) throw HTTPError(400, 'query string is invalid');

  let messages: Message[] = [];

  for (const channel of data.channels) {
    const channelSearches = channel.messages.filter(message => message.message.toLowerCase().includes(queryStr.toLowerCase()));
    messages = messages.concat(channelSearches);
  }

  for (const dm of data.dms) {
    const dmSearches = dm.messages.filter(message => message.message.toLowerCase().includes(queryStr.toLowerCase()));
    messages = messages.concat(dmSearches);
  }

  return { messages: messages };
}
