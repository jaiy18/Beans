import { authRegister, dmMessages, messageSendDm, dmCreate, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);
describe('/dm/messages/v1', () => {
  describe('errors', () => {
    test('dmId does not refer to a valid channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      dmCreate(register.token, [register2.authUserId]);
      const data = dmMessages(register.token, -1, 0);
      expect(data).toEqual(400);
    });
    test('dmId is valid and the authorised user is not a member of the DM', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const register3 = authRegister('kimmaree@gmail.com', 'helloworld', 'kim', 'maree');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const data = dmMessages(register3.token, dm.dmId, 0);
      expect(data).toEqual(403);
    });
    test('start is greater than the total number of messages in the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const data = dmMessages(register.token, dm.dmId, 1);
      expect(data).toEqual(400);
    });
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const data = dmMessages(register.token + '1', dm.dmId, 0);
      expect(data).toEqual(403);
    });
  });
  describe('success', () => {
    test('Zero messages', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const data = dmMessages(register.token, dm.dmId, 0);
      expect(data).toStrictEqual({
        messages: [],
        start: 0,
        end: -1
      });
    });
    test('less than 50 messages', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const message1 = messageSendDm(register.token, dm.dmId, 'chocolate');
      const message2 = messageSendDm(register.token, dm.dmId, 'icecream');
      const data = dmMessages(register.token, dm.dmId, 0);
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
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);

      messageSendDm(register.token, dm.dmId, 'hi');
      messageSendDm(register.token, dm.dmId, 'hi');
      const message3 = messageSendDm(register.token, dm.dmId, 'hi');
      const message4 = messageSendDm(register.token, dm.dmId, 'hi');
      const message5 = messageSendDm(register.token, dm.dmId, 'hi');
      const message6 = messageSendDm(register.token, dm.dmId, 'hi');
      const message7 = messageSendDm(register.token, dm.dmId, 'hi');
      const message8 = messageSendDm(register.token, dm.dmId, 'hi');
      const message9 = messageSendDm(register.token, dm.dmId, 'hi');
      const message10 = messageSendDm(register.token, dm.dmId, 'hi');
      const message11 = messageSendDm(register.token, dm.dmId, 'hi');
      const message12 = messageSendDm(register.token, dm.dmId, 'hi');
      const message13 = messageSendDm(register.token, dm.dmId, 'hi');
      const message14 = messageSendDm(register.token, dm.dmId, 'hi');
      const message15 = messageSendDm(register.token, dm.dmId, 'hi');
      const message16 = messageSendDm(register.token, dm.dmId, 'hi');
      const message17 = messageSendDm(register.token, dm.dmId, 'hi');
      const message18 = messageSendDm(register.token, dm.dmId, 'hi');
      const message19 = messageSendDm(register.token, dm.dmId, 'hi');
      const message20 = messageSendDm(register.token, dm.dmId, 'hi');
      const message21 = messageSendDm(register.token, dm.dmId, 'hi');
      const message22 = messageSendDm(register.token, dm.dmId, 'hi');
      const message23 = messageSendDm(register.token, dm.dmId, 'hi');
      const message24 = messageSendDm(register.token, dm.dmId, 'hi');
      const message25 = messageSendDm(register.token, dm.dmId, 'hi');
      const message26 = messageSendDm(register.token, dm.dmId, 'hi');
      const message27 = messageSendDm(register.token, dm.dmId, 'hi');
      const message28 = messageSendDm(register.token, dm.dmId, 'hi');
      const message29 = messageSendDm(register.token, dm.dmId, 'hi');
      const message30 = messageSendDm(register.token, dm.dmId, 'hi');
      const message31 = messageSendDm(register.token, dm.dmId, 'hi');
      const message32 = messageSendDm(register.token, dm.dmId, 'hi');
      const message33 = messageSendDm(register.token, dm.dmId, 'hi');
      const message34 = messageSendDm(register.token, dm.dmId, 'hi');
      const message35 = messageSendDm(register.token, dm.dmId, 'hi');
      const message36 = messageSendDm(register.token, dm.dmId, 'hi');
      const message37 = messageSendDm(register.token, dm.dmId, 'hi');
      const message38 = messageSendDm(register.token, dm.dmId, 'hi');
      const message39 = messageSendDm(register.token, dm.dmId, 'hi');
      const message40 = messageSendDm(register.token, dm.dmId, 'hi');
      const message41 = messageSendDm(register.token, dm.dmId, 'hi');
      const message42 = messageSendDm(register.token, dm.dmId, 'hi');
      const message43 = messageSendDm(register.token, dm.dmId, 'hi');
      const message44 = messageSendDm(register.token, dm.dmId, 'hi');
      const message45 = messageSendDm(register.token, dm.dmId, 'hi');
      const message46 = messageSendDm(register.token, dm.dmId, 'hi');
      const message47 = messageSendDm(register.token, dm.dmId, 'hi');
      const message48 = messageSendDm(register.token, dm.dmId, 'hi');
      const message49 = messageSendDm(register.token, dm.dmId, 'hi');
      const message50 = messageSendDm(register.token, dm.dmId, 'hi');
      const message51 = messageSendDm(register.token, dm.dmId, 'hi');
      const message52 = messageSendDm(register.token, dm.dmId, 'hi');
      const data = dmMessages(register.token, dm.dmId, 0);

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
