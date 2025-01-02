import {
  channelsCreate,
  authRegister, channelDetails, channelAddOwner,
  channelRemoveOwner, channelInvite, clear
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/channel/removeOwner/v1', () => {
  describe('errors', () => {
    test('channelId does not refer to a valid channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register.token, -1, register2.token);
      expect(data).toEqual(400);
    });
    test('uId does not refer to a valid user', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register.token, channel.channelId, -1);
      expect(data).toEqual(400);
    });
    test('uId refers to a user who is not an owner of the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register.token, channel.channelId, register2.authUserId);
      expect(data).toEqual(400);
    });
    test('uId refers to a user who is currently the only owner of the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelRemoveOwner(register.token, channel.channelId, register.authUserId);
      expect(data).toEqual(400);
    });
    test('channelId is valid and the authorised user does not have owner permissions in the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register2.token, channel.channelId, register.authUserId);
      expect(data).toStrictEqual(403);
    });
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register.token + '1', channel.channelId, register2.authUserId);
      expect(data).toStrictEqual(403);
    });
  });

  describe('success cases', () => {
    test('owner removes another member of channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      channelAddOwner(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register.token, channel.channelId, register2.authUserId);
      const details = channelDetails(register2.token, channel.channelId);
      expect(data).toStrictEqual({ });
      expect(details).toStrictEqual({
        name: 'Birthday Party',
        isPublic: true,
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
          },
          {
            uId: register2.authUserId,
            email: 'eloisekelly@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'kelly',
            handleStr: 'eloisekelly'
          }
        ]
      });
    });
    test('owner removes themself from channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      channelAddOwner(register.token, channel.channelId, register2.authUserId);
      const data = channelRemoveOwner(register.token, channel.channelId, register.authUserId);
      const details = channelDetails(register2.token, channel.channelId);
      expect(data).toStrictEqual({ });
      expect(details).toStrictEqual({
        name: 'Birthday Party',
        isPublic: true,
        ownerMembers: [
          {
            uId: register2.authUserId,
            email: 'eloisekelly@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'kelly',
            handleStr: 'eloisekelly'
          }
        ],
        allMembers: [
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          },
          {
            uId: register2.authUserId,
            email: 'eloisekelly@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'kelly',
            handleStr: 'eloisekelly'
          }
        ]
      });
    });
    test('global owner removes another member of channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register2.token, 'Birthday Party', true);
      channelInvite(register2.token, channel.channelId, register.authUserId);
      channelAddOwner(register.token, channel.channelId, register.authUserId);
      const data = channelRemoveOwner(register.token, channel.channelId, register2.authUserId);
      const details = channelDetails(register2.token, channel.channelId);
      expect(data).toStrictEqual({ });
      expect(details).toStrictEqual({
        name: 'Birthday Party',
        isPublic: true,
        ownerMembers: [
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          },
        ],
        allMembers: [
          {
            uId: register2.authUserId,
            email: 'eloisekelly@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'kelly',
            handleStr: 'eloisekelly'
          },
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          },
        ]
      });
    });
    test('global owner removes themself', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register2.token, 'Birthday Party', true);
      channelInvite(register2.token, channel.channelId, register.authUserId);
      channelAddOwner(register.token, channel.channelId, register.authUserId);
      const data = channelRemoveOwner(register.token, channel.channelId, register.authUserId);
      const details = channelDetails(register2.token, channel.channelId);
      expect(data).toStrictEqual({ });
      expect(details).toStrictEqual({
        name: 'Birthday Party',
        isPublic: true,
        ownerMembers: [
          {
            uId: register2.authUserId,
            email: 'eloisekelly@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'kelly',
            handleStr: 'eloisekelly'
          },
        ],
        allMembers: [
          {
            uId: register2.authUserId,
            email: 'eloisekelly@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'kelly',
            handleStr: 'eloisekelly'
          },
          {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          },
        ]
      });
    });
  });
});
