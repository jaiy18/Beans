import {
  dmCreate, authRegister, dmMessages, clear, messageSendLaterDm,
  messageEdit, messageShare, messageRemove
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);
describe('Testing messageSendLaterDm', () => {
  describe('errors', () => {
    test('dmId is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const later = messageSendLaterDm(register.token, -1, 'send me later', Math.floor(Date.now() / 1000) + 120);
      expect(later).toEqual(400);
    });
    test('length of message is less than 1 char or over 1000 chars', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const dm = dmCreate(register.token, []);
      const over1000chars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na';
      const later1000chars = messageSendLaterDm(register.token, dm.dmId, over1000chars, Math.floor(Date.now() / 1000) + 120);
      expect(later1000chars).toEqual(400);
      const laterEmpty = messageSendLaterDm(register.token, dm.dmId, '', Math.floor(Date.now() / 1000) + 120);
      expect(laterEmpty).toEqual(400);
    });
    test('time sent is in the past', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const dm = dmCreate(register.token, []);
      const later = messageSendLaterDm(register.token, dm.dmId, 'send me later', Math.floor(Date.now() / 1000) - 120);
      expect(later).toEqual(400);
    });
    test('authorised user is not a member of the channel they are trying to post to', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const dm = dmCreate(register.token, []);
      const later = messageSendLaterDm(register2.token, dm.dmId, 'send me later', Math.floor(Date.now() / 1000) + 120);
      expect(later).toEqual(403);
    });
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const dm = dmCreate(register.token, []);
      const later = messageSendLaterDm(register.token + '1', dm.dmId, 'send me later', Math.floor(Date.now() / 1000) + 120);
      expect(later).toEqual(403);
    });
  });
  describe('success cases', () => {
    test('message is sent later', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const dm = dmCreate(register.token, []);
      const time = Math.floor(Date.now() / 1000);
      const later = messageSendLaterDm(register.token, dm.dmId, 'send later', time + 2);
      expect(later).toStrictEqual({
        messageId: later.messageId
      });
      const dmMessagesNow = dmMessages(register.token, dm.dmId, 0);
      expect(dmMessagesNow).toStrictEqual({
        messages: [],
        start: 0,
        end: -1
      });
      const edit = messageEdit(register.token, later.messageId, 'error');
      expect(edit).toEqual(400);
      const share = messageShare(register.token, later.messageId, 'error', -1, dm.dmId);
      expect(share).toEqual(400);
      const remove = messageRemove(register.token, later.messageId);
      expect(remove).toEqual(400);

      const wait = Date.now() + 2500;
      while (Date.now() < wait) {
        continue;
      }

      const dmMessagesLater = dmMessages(register.token, dm.dmId, 0);
      expect(dmMessagesLater).toStrictEqual({
        messages: [
          {
            uId: register.authUserId,
            message: 'send later',
            messageId: expect.any(Number),
            timeSent: time + 2
          }
        ],
        start: 0,
        end: -1
      });
    });
  });
});
