import { authRegister, dmCreate, messageSendDm, channelsCreate, dmMessages, messageRemove, channelJoin, messageSend, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing messageRemoveV1 for it-2', () => {
  test('Success: removes message from dm', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    const dmSend2 = messageSendDm(register2.token, dm1.dmId, 'PLS');
    messageSendDm(register2.token, dm1.dmId, 'WORK');
    messageRemove(register1.token, dmSend2.messageId);
    const fnctmessages = dmMessages(register1.token, 0, 0);
    const returnobj = {
      messages: fnctmessages.messages,
      end: -1,
      start: 0
    };
    expect(fnctmessages).toMatchObject(returnobj);
  });
  test('Invalid messageId', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    messageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = messageRemove(register2.token, 4242424);
    expect(returnval).toBe(400);
  });
  test('user not member of dm', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    const dmSend2 = messageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = messageRemove(register3.token, dmSend2.messageId);
    expect(returnval).toBe(400);
  });
  test('global owner cannot remove', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const dm1 = dmCreate(register2.token, [register3.authUserId, register1.authUserId]);
    const dmSend = messageSendDm(register3.token, dm1.dmId, 'Inshallah');
    const returnval = messageRemove(register1.token, dmSend.messageId);
    expect(returnval).toBe(403);
  });
  test('user did not send that message', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const dmSend = messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    messageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = messageRemove(register2.token, dmSend.messageId);
    expect(returnval).toBe(403);
  });
  test('Success: removes message from channel', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    channelJoin(register2.token, channel1.channelId);
    messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    messageSend(register2.token, channel1.channelId, 'message3');
    const message4 = messageSend(register2.token, channel1.channelId, 'message4');
    const removemsg = messageRemove(register1.token, message4.messageId);
    expect(removemsg).toStrictEqual({});
  });
  test('Invalid messageId', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    const returnval = messageRemove(register1.token, 4242424);
    expect(returnval).toBe(400);
  });
  test('user not member of channel', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const message1 = messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    const returnval = messageRemove(register2.token, message1.messageId);
    expect(returnval).toBe(400);
  });
  test('user did not send that message', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    channelJoin(register2.token, channel1.channelId);
    const message1 = messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register2.token, channel1.channelId, 'message2');
    const returnval = messageRemove(register2.token, message1.messageId);
    expect(returnval).toBe(403);
  });
  test('channel owner removes', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    channelJoin(register2.token, channel1.channelId);
    messageSend(register1.token, channel1.channelId, 'message1');
    const message2 = messageSend(register2.token, channel1.channelId, 'message2');
    const returnval = messageRemove(register1.token, message2.messageId);
    expect(returnval).toStrictEqual({});
  });
  test('global owner cannot remove channel owner msg', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const channel1 = channelsCreate(register2.token, 'channelOne', true);
    channelJoin(register1.token, channel1.channelId);
    channelJoin(register3.token, channel1.channelId);
    messageSend(register2.token, channel1.channelId, 'message1');
    const message2 = messageSend(register1.token, channel1.channelId, 'message2');
    const returnval = messageRemove(register1.token, message2.messageId);
    expect(returnval).toBe(403);
  });
});
