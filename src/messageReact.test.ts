import { authRegister, channelsCreate, messageSend, clear, channelJoin, messageSendDm, dmCreate, messageReact } from './serverHelperFunctions';
beforeEach(clear);
afterAll(clear);

describe('/message/react/v1', () => {
  test('success with one person, public channel', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    const react = messageReact(reg.token, message.messageId, 1);
    expect(react).toStrictEqual({});
  });
  test('success with one person, DM', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const dm = dmCreate(reg.token, []);
    const messageDm = messageSendDm(reg.token, dm.dmId, 'i like dogs');
    const react = messageReact(reg.token, messageDm.messageId, 1);

    expect(react).toStrictEqual({});
  });
  test('success with two people, DM', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const reg2 = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const dm = dmCreate(reg.token, [reg2.authUserId]);
    const messageDm = messageSendDm(reg.token, dm.dmId, 'i like dogs');
    messageReact(reg.token, messageDm.messageId, 1);
    const react = messageReact(reg2.token, messageDm.messageId, 1);

    expect(react).toStrictEqual({});
  });
  test('success with two people, public channel', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const reg2 = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const channel = channelsCreate(reg.token, 'channel', true);
    channelJoin(reg2.token, channel.channelId);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    messageReact(reg.token, message.messageId, 1);
    const react = messageReact(reg2.token, message.messageId, 1);
    expect(react).toStrictEqual({});
  });

  test('messageId is not a valid message within channel or DM, channel', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const dm = dmCreate(reg.token, []);
    messageSendDm(reg.token, dm.dmId, 'i like dogs');
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    const react = messageReact(reg.token, message.messageId + 1, 1);
    expect(react).toBe(400);
  });
  test('reactId is not valid', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    const react = messageReact(reg.token, message.messageId, 2);
    expect(react).toBe(400);
  });
  test('user has already reacted', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(reg.token, 'channel', true);
    const message = messageSend(reg.token, channel.channelId, 'i like dogs');
    messageReact(reg.token, message.messageId, 1);
    const react = messageReact(reg.token, message.messageId, 1);
    expect(react).toBe(400);
  });
  test('user has already reacted in dm', () => {
    const reg = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const dm = dmCreate(reg.token, []);
    const messageDm = messageSendDm(reg.token, dm.dmId, 'i like dogs');
    messageReact(reg.token, messageDm.messageId, 1);
    const react = messageReact(reg.token, messageDm.messageId, 1);
    expect(react).toBe(400);
  });
});
