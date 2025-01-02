import {
  channelsCreate, authRegister,
  channelDetails, channelInvite, channelLeave, channelsListAll,
  messageSend, channelMessages, clear, standupStart
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/channel/leave/v1', () => {
  describe('errors', () => {
    test('channelId does not refer to a valid channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = channelLeave(register.token, -1);
      expect(data).toEqual(400);
    });
    test('channelId is valid and the authorised user is not a member of the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelLeave(register2.token, channel.channelId);
      expect(data).toEqual(403);
    });
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelLeave(register.token + '1', channel.channelId);
      expect(data).toEqual(403);
    });
    test('standup active', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      standupStart(register.token, channel.channelId, 1);
      const leave = channelLeave(register2.token, channel.channelId);
      expect(leave).toStrictEqual({});
      const data = channelLeave(register.token, channel.channelId);
      expect(data).toEqual(400);
      const wait = Date.now() + 1000;
      while (Date.now() < wait) {
        continue;
      }
    });
  });
  // describe('success cases', () => {
  test('remove only member from channel, no messages, channel still remains', () => {
    const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
    const channel = channelsCreate(register.token, 'Birthday Party', true);
    const data = channelLeave(register.token, channel.channelId);
    const listAll = channelsListAll(register.token);
    expect(data).toStrictEqual({});
    expect(listAll).toStrictEqual({
      channels: [{
        channelId: channel.channelId,
        name: 'Birthday Party'
      }]
    });
  });
  test('remove owner of channel', () => {
    const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
    const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
    const channel = channelsCreate(register.token, 'Birthday Party', true);
    channelInvite(register.token, channel.channelId, register2.authUserId);
    const data = channelLeave(register.token, channel.channelId);
    const details = channelDetails(register2.token, channel.channelId);
    expect(data).toStrictEqual({ });
    expect(details).toStrictEqual({
      name: 'Birthday Party',
      isPublic: true,
      ownerMembers: [],
      allMembers: [{
        uId: register2.authUserId,
        email: 'eloisekelly@gmail.com',
        nameFirst: 'eloise',
        nameLast: 'kelly',
        handleStr: 'eloisekelly'
      }],
    });
  });
  test('remove member of channel', () => {
    const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
    const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
    const channel = channelsCreate(register.token, 'Birthday Party', true);
    channelInvite(register.token, channel.channelId, register2.authUserId);
    const data = channelLeave(register2.token, channel.channelId);
    const details = channelDetails(register.token, channel.channelId);
    expect(data).toStrictEqual({ });
    expect(details).toStrictEqual({
      name: 'Birthday Party',
      isPublic: true,
      ownerMembers: [{
        uId: register.authUserId,
        email: 'eloise@gmail.com',
        nameFirst: 'eloise',
        nameLast: 'pozzi',
        handleStr: 'eloisepozzi'
      }],
      allMembers: [{
        uId: register.authUserId,
        email: 'eloise@gmail.com',
        nameFirst: 'eloise',
        nameLast: 'pozzi',
        handleStr: 'eloisepozzi'
      }],
    });
  });
  test('check that user (owner) messages still remain', () => {
    const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
    const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
    const channel = channelsCreate(register.token, 'Birthday Party', true);
    channelInvite(register.token, channel.channelId, register2.authUserId);
    const message1 = messageSend(register.token, channel.channelId, 'I am leaving the channel');
    const message2 = messageSend(register2.token, channel.channelId, 'I am staying in the channel');
    const data = channelLeave(register.token, channel.channelId);
    const messages = channelMessages(register2.token, channel.channelId, 0);
    expect(data).toStrictEqual({ });
    expect(messages).toStrictEqual({
      messages: [
        {
          messageId: message2.messageId,
          uId: register2.authUserId,
          message: 'I am staying in the channel',
          timeSent: expect.any(Number)
        },
        {
          messageId: message1.messageId,
          uId: register.authUserId,
          message: 'I am leaving the channel',
          timeSent: expect.any(Number)
        }
      ],
      start: 0,
      end: -1
    });
  });
});
