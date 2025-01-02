import { authRegister, dmCreate, messageSendDm, channelsCreate, messageUnpin, messagePin, channelJoin, messageSend, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing messageUnpin for it-3', () => {
  test('Success: unpins message from dm', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    const dmSend2 = messageSendDm(register2.token, dm1.dmId, 'PLS');
    messageSendDm(register2.token, dm1.dmId, 'WORK');
    messagePin(register1.token, dmSend2.messageId);
    const unpinMessage = messageUnpin(register1.token, dmSend2.messageId);
    expect(unpinMessage).toStrictEqual({});
  });

  test('not pinnedd', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const dmSend2 = messageSendDm(register2.token, dm1.dmId, 'PLS');
    messageUnpin(register1.token, dmSend2.messageId);
    const unpinMessage2 = messageUnpin(register1.token, dmSend2.messageId);
    expect(unpinMessage2).toBe(400);
  });

  test('Invalid messageId', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    messageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = messageUnpin(register2.token, 4242424);
    expect(returnval).toBe(400);
  });
  test('user not member of dm', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    const dmSend2 = messageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = messageUnpin(register3.token, dmSend2.messageId);
    expect(returnval).toBe(400);
  });
  test('user did not send that message', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const dmSend = messageSendDm(register1.token, dm1.dmId, 'Inshallah');
    messageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = messageUnpin(register2.token, dmSend.messageId);
    expect(returnval).toBe(403);
  });
  test('Success: unpins message from channel', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    channelJoin(register2.token, channel1.channelId);
    messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    const sendMessage = messageSend(register2.token, channel1.channelId, 'message3');
    messagePin(register1.token, sendMessage.messageId);
    const unpinMessage = messageUnpin(register1.token, sendMessage.messageId);
    expect(unpinMessage).toStrictEqual({});
  });
  test('already unpinned', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    channelJoin(register2.token, channel1.channelId);
    messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    const sendMessage = messageSend(register2.token, channel1.channelId, 'message3');
    messageUnpin(register1.token, sendMessage.messageId);
    const unpinMessage2 = messageUnpin(register1.token, sendMessage.messageId);
    expect(unpinMessage2).toBe(400);
  });
  test('Invalid messageId', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    const returnval = messageUnpin(register1.token, 4242424);
    expect(returnval).toBe(400);
  });
  test('user not member of channel', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const message1 = messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register1.token, channel1.channelId, 'message2');
    const returnval = messageUnpin(register2.token, message1.messageId);
    expect(returnval).toBe(400);
  });
  test('user did not send that message', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    channelJoin(register2.token, channel1.channelId);
    const message1 = messageSend(register1.token, channel1.channelId, 'message1');
    messageSend(register2.token, channel1.channelId, 'message2');
    const returnval = messageUnpin(register2.token, message1.messageId);
    expect(returnval).toBe(403);
  });
});
