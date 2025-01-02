import {
  channelsCreate, authRegister, messageSend, messageEdit,
  channelInvite, channelMessages, dmMessages,
  dmCreate, messageSendDm, clear
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing messageEdit', () => {
  describe('errors', () => {
    test('length of message is over 1000 characters', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const message = messageSend(register.token, channel.channelId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const over1000chars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na';
      const data = messageEdit(register.token, message.messageId, over1000chars);
      expect(data).toEqual(400);
    });
    test('messageId does not refer to a valid message within a channel/DM that the authorised user has joined', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const message = messageSend(register.token, channel.channelId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const edit = 'cat';
      const data = messageEdit(register.token, message.messageId + 1, edit);
      expect(data).toEqual(400);
    });
    test('the message was not sent by the authorised user making this request and the user does not have owner permissions in the channel/DM', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const message = messageSend(register.token, channel.channelId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const edit = 'cat';
      const data = messageEdit(register2.token, message.messageId, edit);
      expect(data).toEqual(403);
    });
    test('the message was not sent by the authorised user making this request and the user does not have owner permissions in the channel/DM', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const message = messageSendDm(register.token, dm.dmId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const edit = 'cat';
      const data = messageEdit(register2.token, message.messageId, edit);
      expect(data).toEqual(403);
    });
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const message = messageSend(register.token, channel.channelId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const edit = 'cat';
      const data = messageEdit(register.token + 1, message.messageId, edit);
      expect(data).toEqual(403);
    });
  });
  describe('errors', () => {
    test('user that sent message in channel, edits message', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const message = messageSend(register2.token, channel.channelId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const edit = 'cat';
      const data = messageEdit(register2.token, message.messageId, edit);
      expect(data).toStrictEqual({});
      const messages = channelMessages(register.token, channel.channelId, 0);
      expect(messages).toStrictEqual({
        messages: [
          {
            messageId: message.messageId,
            uId: register2.authUserId,
            message: 'cat',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
    test('user with owner perms in channel edits message', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const message = messageSend(register2.token, channel.channelId, 'dog');
      expect(message).toStrictEqual({ messageId: message.messageId });
      const edit = 'cat';
      const data = messageEdit(register.token, message.messageId, edit);
      expect(data).toStrictEqual({});
      const messages = channelMessages(register.token, channel.channelId, 0);
      expect(messages).toStrictEqual({
        messages: [
          {
            messageId: message.messageId,
            uId: register2.authUserId,
            message: 'cat',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
      const editEmpty = '';
      const emptyStringData = messageEdit(register.token, message.messageId, editEmpty);
      expect(emptyStringData).toStrictEqual({});
      const messagesEmptyStr = channelMessages(register.token, channel.channelId, 0);
      expect(messagesEmptyStr).toStrictEqual({
        messages: [],
        start: 0,
        end: -1
      });
    });
    test('user with owner perms in DM edits message', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const message = messageSendDm(register2.token, dm.dmId, 'dog');
      expect(message).toStrictEqual({ messageId: expect.any(Number) });
      const edit = 'cat';
      const data = messageEdit(register.token, message.messageId, edit);
      expect(data).toStrictEqual({});
      const messages = dmMessages(register.token, dm.dmId, 0);
      expect(messages).toStrictEqual({
        messages: [
          {
            messageId: message.messageId,
            uId: register2.authUserId,
            message: 'cat',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
    test('user that sent message in DM, edits message', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const message = messageSendDm(register2.token, dm.dmId, 'dog');
      expect(message).toStrictEqual({ messageId: expect.any(Number) });
      const edit = 'cat';
      const data = messageEdit(register2.token, message.messageId, edit);
      expect(data).toStrictEqual({});
      const messages = dmMessages(register.token, dm.dmId, 0);
      expect(messages).toStrictEqual({
        messages: [
          {
            messageId: message.messageId,
            uId: register2.authUserId,
            message: 'cat',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
    test('an empty string deletes the message from dm', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, [register2.authUserId]);
      const message = messageSendDm(register2.token, dm.dmId, 'dog');
      expect(message).toStrictEqual({ messageId: expect.any(Number) });
      const edit = '';
      const data = messageEdit(register2.token, message.messageId, edit);
      expect(data).toStrictEqual({});
      const messages = dmMessages(register.token, dm.dmId, 0);
      expect(messages).toStrictEqual({
        messages: [],
        start: 0,
        end: -1
      });
    });
  });
});
