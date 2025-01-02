import {
  channelsCreate, authRegister, adminUserRemove,
  channelDetails, channelInvite, messageSend, messageSendDm,
  dmMessages, dmDetails, userProfile, usersAll, dmCreate,
  channelMessages, authLogin, authLogout, channelAddOwner,
  clear
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/admin/user/remove/v1', () => {
  describe('errors', () => {
    test('uId does not refer to a valid user', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = adminUserRemove(register.token, -1);
      expect(data).toEqual(400);
    });
    test('uId refers to a user who is the only global owner', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = adminUserRemove(register.token, register.authUserId);
      expect(data).toEqual(400);
    });
    test('the authorised user is not a global owner', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register1 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const data = adminUserRemove(register1.token, register.authUserId);
      expect(data).toEqual(403);
    });
    test('the token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register1 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const data = adminUserRemove(register.token + '1', register1.authUserId);
      expect(data).toEqual(403);
    });
  });
  describe('success cases', () => {
    test('successfully removed from Beans, channels, DMs and users', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register1 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');

      const registerLogout = authRegister('kim@gmail.com', 'password', 'kim', 'possible');
      authLogout(registerLogout.token);
      const secondLogin = authLogin('eloisekelly@gmail.com', 'kellykellykelly');
      const secondChannel = channelsCreate(secondLogin.token, 'Pool Party', false);
      messageSend(secondLogin.token, secondChannel.channelId, 'should be removed');

      const channel = channelsCreate(register.token, 'Birthday Party', false);
      channelInvite(register.token, channel.channelId, register1.authUserId);
      channelAddOwner(register.token, channel.channelId, register1.authUserId);
      const message1 = messageSend(register.token, channel.channelId, 'this message will stay');
      const message2 = messageSend(register1.token, channel.channelId, 'icecream');

      const dm = dmCreate(register.token, [register1.authUserId]);
      dmCreate(register1.token, []);
      const messageDm1 = messageSendDm(register.token, dm.dmId, 'this message will stay');
      const messageDm2 = messageSendDm(register1.token, dm.dmId, 'icecream');

      const data = adminUserRemove(register.token, register1.authUserId);
      const secondRemove = adminUserRemove(register.token, registerLogout.authUserId);
      expect(secondRemove).toStrictEqual({});
      expect(data).toStrictEqual({});
      const removedFromUsersAll = usersAll(register.token);
      expect(removedFromUsersAll).toStrictEqual({
        users: [{
          uId: register.authUserId,
          email: 'eloise@gmail.com',
          nameFirst: 'eloise',
          nameLast: 'pozzi',
          handleStr: 'eloisepozzi'
        }]
      });

      const removedFromAllChannels = channelDetails(register.token, channel.channelId);
      expect(removedFromAllChannels).toStrictEqual({
        name: 'Birthday Party',
        isPublic: false,
        ownerMembers: [
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          }
        ],
        allMembers: [
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          }
        ]
      });
      const removedFromAllDms = dmDetails(register.token, dm.dmId);
      expect(removedFromAllDms).toStrictEqual({
        name: 'eloisekelly, eloisepozzi',
        members: [
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          }
        ]
      });
      const profileStillRetriveable = userProfile(register.token, register1.authUserId);
      const profileStillRetriveable2 = userProfile(register.token, registerLogout.authUserId);
      expect(profileStillRetriveable).toStrictEqual({
        user: {
          uId: register1.authUserId,
          email: '',
          nameFirst: 'Removed',
          nameLast: 'user',
          handleStr: ''
        }
      });

      expect(profileStillRetriveable2).toStrictEqual({
        user: {
          uId: registerLogout.authUserId,
          email: '',
          nameFirst: 'Removed',
          nameLast: 'user',
          handleStr: ''
        }
      });
      const contentsOfMessagesReplacedChannel = channelMessages(register.token, channel.channelId, 0);
      expect(contentsOfMessagesReplacedChannel).toStrictEqual({
        messages: [
          {
            messageId: message2.messageId,
            uId: register1.authUserId,
            message: 'Removed user',
            timeSent: expect.any(Number),
          },
          {
            messageId: message1.messageId,
            uId: register.authUserId,
            message: 'this message will stay',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });

      const contentsOfMessagesReplacedDm = dmMessages(register.token, dm.dmId, 0);
      expect(contentsOfMessagesReplacedDm).toStrictEqual({
        messages: [
          {
            messageId: messageDm2.messageId,
            uId: register1.authUserId,
            message: 'Removed user',
            timeSent: expect.any(Number),
          },
          {
            messageId: messageDm1.messageId,
            uId: register.authUserId,
            message: 'this message will stay',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
  });
});
