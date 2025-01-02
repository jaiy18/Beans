import {
  channelsCreate, channelInvite, authRegister, messageSend,
  dmCreate, messageSendDm, search, clear
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing search', () => {
  describe('errors', () => {
    test('length of query string is over 1000 characters', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const over1000chars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na';
      const data = search(register.token, over1000chars);
      expect(data).toEqual(400);
    });
    test('length of query string less than 1 character', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const query = '';
      const data = search(register.token, query);
      expect(data).toEqual(400);
    });
    test('token invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = search(register.token + '1', 'message');
      expect(data).toEqual(403);
    });
  });
  describe('Success cases', () => {
    test('user returns messages only from a channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const message1 = messageSend(register.token, channel.channelId, 'water bottle');
      messageSend(register.token, channel.channelId, 'fire truck');
      const message3 = messageSend(register.token, channel.channelId, 'water water');
      const message4 = messageSend(register.token, channel.channelId, 'agua is water');
      const message5 = messageSend(register.token, channel.channelId, 'this water is gross');
      const message6 = messageSend(register.token, channel.channelId, 'WaTer');
      messageSend(register.token, channel.channelId, 'w a t e r');
      const message8 = messageSend(register2.token, channel.channelId, 'message sent from another user water');
      const query = search(register.token, 'water');
      expect(query).toStrictEqual({
        messages: [
          {
            messageId: message1.messageId,
            uId: register.authUserId,
            message: 'water bottle',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message3.messageId,
            uId: register.authUserId,
            message: 'water water',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message4.messageId,
            uId: register.authUserId,
            message: 'agua is water',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message5.messageId,
            uId: register.authUserId,
            message: 'this water is gross',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message6.messageId,
            uId: register.authUserId,
            message: 'WaTer',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message8.messageId,
            uId: register2.authUserId,
            message: 'message sent from another user water',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
        ]
      });
    });
    test('user returns messages only from a DM', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const message1 = messageSendDm(register2.token, dm.dmId, 'my dog is so cute');
      messageSendDm(register2.token, dm.dmId, 'look at the cats!');
      const message3 = messageSendDm(register2.token, dm.dmId, 'this is my dog, peppa!');
      const message4 = messageSendDm(register.token, dm.dmId, 'stop talking about your dog');
      const query = search(register.token, 'dog');
      expect(query).toMatchObject({
        messages: [
          {
            messageId: message1.messageId,
            uId: register2.authUserId,
            message: 'my dog is so cute',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message3.messageId,
            uId: register2.authUserId,
            message: 'this is my dog, peppa!',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: message4.messageId,
            uId: register.authUserId,
            message: 'stop talking about your dog',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          }
        ]
      });
    });
    test('user returns messages from both channels and DMs', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const dm = dmCreate(register.token, [register2.authUserId]);
      const messageChannel1 = messageSend(register2.token, channel.channelId, 'WHATS your netflix login?');
      const messageChannel2 = messageSend(register.token, channel.channelId, 'why do you need my netflix login?');
      messageSend(register.token, channel.channelId, 'i cant get into to mine');
      const messageDm1 = messageSendDm(register2.token, dm.dmId, 'i use my sisters netflix login');
      messageSendDm(register2.token, dm.dmId, 'netflix');
      const query = search(register2.token, 'netflix login');
      expect(query).toStrictEqual({
        messages: [
          {
            messageId: messageChannel1.messageId,
            uId: register2.authUserId,
            message: 'WHATS your netflix login?',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: messageChannel2.messageId,
            uId: register.authUserId,
            message: 'why do you need my netflix login?',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          },
          {
            messageId: messageDm1.messageId,
            uId: register2.authUserId,
            message: 'i use my sisters netflix login',
            timeSent: expect.any(Number),
            reacts: [],
            isPinned: false
          }
        ]
      });
    });
    test('user is not in any channels/DMs that contain the query', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      messageSend(register.token, channel.channelId, 'hello sam');
      messageSend(register.token, channel.channelId, 'hello alex');
      const query = search(register2.token, 'kanye');
      expect(query).toMatchObject({ messages: [] });
    });
  });
});
