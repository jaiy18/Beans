import { authRegister, clear, channelsCreate, channelMessages, messageSend } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/channel/messages/v2', () => {
  describe('errors', () => {
    test('channelId does not refer to a valid channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = channelMessages(register.token, -1, 0);
      expect(data).toEqual(400);
    });

    test('start is greater than the total number of messages in the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelMessages(register.token, channel.channelId, 3);
      expect(data).toEqual(400);
    });

    test('the user is not a member of the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelMessages(register2.token, channel.channelId, 0);
      expect(data).toStrictEqual(403);
    });
    test('token is invalidl', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelMessages(register.token + '1', channel.channelId, 0);
      expect(data).toStrictEqual(403);
    });
  });
  describe('success', () => {
    test('Zero messages', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({
        messages: [],
        start: 0,
        end: -1
      });
    });
    test('less than 50 messages', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const message1 = messageSend(register.token, channel.channelId, 'chocolate');
      const message2 = messageSend(register.token, channel.channelId, 'icecream');
      const data = channelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({
        messages: [
          {
            messageId: message2.messageId,
            uId: register.authUserId,
            message: 'icecream',
            timeSent: expect.any(Number),
          },
          {
            messageId: message1.messageId,
            uId: register.authUserId,
            message: 'chocolate',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
    test('0 to 52 messages', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      messageSend(register.token, channel.channelId, 'hi');
      messageSend(register.token, channel.channelId, 'hi');
      const message3 = messageSend(register.token, channel.channelId, 'hi');
      const message4 = messageSend(register.token, channel.channelId, 'hi');
      const message5 = messageSend(register.token, channel.channelId, 'hi');
      const message6 = messageSend(register.token, channel.channelId, 'hi');
      const message7 = messageSend(register.token, channel.channelId, 'hi');
      const message8 = messageSend(register.token, channel.channelId, 'hi');
      const message9 = messageSend(register.token, channel.channelId, 'hi');
      const message10 = messageSend(register.token, channel.channelId, 'hi');
      const message11 = messageSend(register.token, channel.channelId, 'hi');
      const message12 = messageSend(register.token, channel.channelId, 'hi');
      const message13 = messageSend(register.token, channel.channelId, 'hi');
      const message14 = messageSend(register.token, channel.channelId, 'hi');
      const message15 = messageSend(register.token, channel.channelId, 'hi');
      const message16 = messageSend(register.token, channel.channelId, 'hi');
      const message17 = messageSend(register.token, channel.channelId, 'hi');
      const message18 = messageSend(register.token, channel.channelId, 'hi');
      const message19 = messageSend(register.token, channel.channelId, 'hi');
      const message20 = messageSend(register.token, channel.channelId, 'hi');
      const message21 = messageSend(register.token, channel.channelId, 'hi');
      const message22 = messageSend(register.token, channel.channelId, 'hi');
      const message23 = messageSend(register.token, channel.channelId, 'hi');
      const message24 = messageSend(register.token, channel.channelId, 'hi');
      const message25 = messageSend(register.token, channel.channelId, 'hi');
      const message26 = messageSend(register.token, channel.channelId, 'hi');
      const message27 = messageSend(register.token, channel.channelId, 'hi');
      const message28 = messageSend(register.token, channel.channelId, 'hi');
      const message29 = messageSend(register.token, channel.channelId, 'hi');
      const message30 = messageSend(register.token, channel.channelId, 'hi');
      const message31 = messageSend(register.token, channel.channelId, 'hi');
      const message32 = messageSend(register.token, channel.channelId, 'hi');
      const message33 = messageSend(register.token, channel.channelId, 'hi');
      const message34 = messageSend(register.token, channel.channelId, 'hi');
      const message35 = messageSend(register.token, channel.channelId, 'hi');
      const message36 = messageSend(register.token, channel.channelId, 'hi');
      const message37 = messageSend(register.token, channel.channelId, 'hi');
      const message38 = messageSend(register.token, channel.channelId, 'hi');
      const message39 = messageSend(register.token, channel.channelId, 'hi');
      const message40 = messageSend(register.token, channel.channelId, 'hi');
      const message41 = messageSend(register.token, channel.channelId, 'hi');
      const message42 = messageSend(register.token, channel.channelId, 'hi');
      const message43 = messageSend(register.token, channel.channelId, 'hi');
      const message44 = messageSend(register.token, channel.channelId, 'hi');
      const message45 = messageSend(register.token, channel.channelId, 'hi');
      const message46 = messageSend(register.token, channel.channelId, 'hi');
      const message47 = messageSend(register.token, channel.channelId, 'hi');
      const message48 = messageSend(register.token, channel.channelId, 'hi');
      const message49 = messageSend(register.token, channel.channelId, 'hi');
      const message50 = messageSend(register.token, channel.channelId, 'hi');
      const message51 = messageSend(register.token, channel.channelId, 'hi');
      const message52 = messageSend(register.token, channel.channelId, 'hi');

      const data = channelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({
        messages: [
          {
            messageId: message52.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message51.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message50.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message49.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message48.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message47.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message46.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message45.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message44.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message43.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message42.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message41.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message40.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message39.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message38.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message37.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message36.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message35.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message34.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message33.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message32.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message31.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message30.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message29.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message28.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message27.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message26.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message25.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message24.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message23.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message22.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message21.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message20.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message19.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message18.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message17.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message16.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message15.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message14.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message13.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message12.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message11.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message10.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message9.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message8.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message7.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message6.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message5.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message4.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          },
          {
            messageId: message3.messageId,
            uId: register.authUserId,
            message: 'hi',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: 50
      });
    });
  });
});
