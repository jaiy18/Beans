import { authRegister, channelsCreate, messageSend, clear, channelJoin, messageSendDm, dmCreate, messageReact, messageUnreact } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/message/unreact/v1', () => {
  test('Successfully remove a react from a public channel', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    messageReact(reg.token, message.messageId, 1);
    const unreact = messageUnreact(reg.token, message.messageId, 1);
    expect(unreact).toStrictEqual({});
  });
  test('Successfully remove a react from a DM', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const dm = dmCreate(reg.token, []);
    const messageDm = messageSendDm(reg.token, dm.dmId, 'i like dogs');
    messageReact(reg.token, messageDm.messageId, 1);
    const unreact = messageUnreact(reg.token, messageDm.messageId, 1);
    expect(unreact).toStrictEqual({});
  });

  test('Successfully remove one react from a public channel of two people', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const reg2 = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const channel = channelsCreate(reg.token, 'channel', true);
    channelJoin(reg2.token, channel.channelId);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    messageReact(reg.token, message.messageId, 1);
    messageReact(reg2.token, message.messageId, 1);

    const unreact = messageUnreact(reg2.token, message.messageId, 1);
    expect(unreact).toStrictEqual({});
  });
  test('Successfully remove one react from a DM of two people', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const reg2 = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const dm = dmCreate(reg.token, [reg2.authUserId]);
    const messageDm = messageSendDm(reg.token, dm.dmId, 'i like dogs');
    messageReact(reg.token, messageDm.messageId, 1);
    messageReact(reg2.token, messageDm.messageId, 1);
    const unreact = messageUnreact(reg2.token, messageDm.messageId, 1);
    expect(unreact).toStrictEqual({});
  });
  test('messageId is not a valid message within channel or DM, channel', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const dm = dmCreate(reg.token, []);
    messageSendDm(reg.token, dm.dmId, 'i like dogs');
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    const Unreact = messageUnreact(reg.token, message.messageId + 1, 1);
    expect(Unreact).toBe(400);
  });
  test('reactId is not valid', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    const Unreact = messageUnreact(reg.token, message.messageId, 2);
    expect(Unreact).toBe(400);
  });
  test('user has not reacted', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    const Unreact = messageUnreact(reg.token, message.messageId, 1);
    expect(Unreact).toBe(400);
  });
  test('user has not reacted', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const dm = dmCreate(reg.token, []);
    const message = messageSendDm(reg.token, dm.dmId, 'i like dogs');
    const Unreact = messageUnreact(reg.token, message.messageId, 1);
    expect(Unreact).toBe(400);
  });
});
