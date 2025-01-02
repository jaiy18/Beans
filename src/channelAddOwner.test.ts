import {
  channelsCreate, authRegister,
  channelDetails, channelInvite, channelAddOwner,
  clear
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/channel/addOwner/v1', () => {
  describe('errors', () => {
    test('channelId does not refer to a valid channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelAddOwner(register.token, -1, register2.authUserId);
      expect(data).toEqual(400);
    });
    test('uId does not refer to a valid user', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelAddOwner(register.token, channel.channelId, -1);
      expect(data).toEqual(400);
    });
    test('uId refers to a user who is not a member of the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelAddOwner(register.token, channel.channelId, register2.authUserId);
      expect(data).toEqual(400);
    });
    test('uId refers to a user who is already an owner of the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      const data = channelAddOwner(register.token, channel.channelId, register.authUserId);
      expect(data).toEqual(400);
    });
    test('channelId is valid and the authorised user does not have owner permissions in the channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelAddOwner(register2.token, channel.channelId, register2.authUserId);
      expect(data).toEqual(403);
    });
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register.token, 'Birthday Party', true);
      channelInvite(register.token, channel.channelId, register2.authUserId);
      const data = channelAddOwner(register.token + '1', channel.channelId, register2.authUserId);
      expect(data).toStrictEqual(403);
    });
  });

  describe('success cases', () => {
    test('owner adds another member of channel', () => {
      authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const register3 = authRegister('kimmaree@gmail.com', 'password123', 'kim', 'maree');
      const channel = channelsCreate(register2.token, 'Birthday Party', true);
      channelInvite(register2.token, channel.channelId, register3.authUserId);
      const data = channelAddOwner(register2.token, channel.channelId, register3.authUserId);
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
          {
            uId: register3.authUserId,
            email: 'kimmaree@gmail.com',
            nameFirst: 'kim',
            nameLast: 'maree',
            handleStr: 'kimmaree'
          }
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
            uId: register3.authUserId,
            email: 'kimmaree@gmail.com',
            nameFirst: 'kim',
            nameLast: 'maree',
            handleStr: 'kimmaree'
          }
        ]
      });
    });
    test('global owner adds another member of channel', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const register3 = authRegister('kimmaree@gmail.com', 'password123', 'kim', 'maree');
      const channel = channelsCreate(register2.token, 'Birthday Party', true);
      channelInvite(register2.token, channel.channelId, register.authUserId);
      channelInvite(register2.token, channel.channelId, register3.authUserId);
      const data = channelAddOwner(register.token, channel.channelId, register3.authUserId);
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
          {
            uId: register3.authUserId,
            email: 'kimmaree@gmail.com',
            nameFirst: 'kim',
            nameLast: 'maree',
            handleStr: 'kimmaree'
          }
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
          {
            uId: register3.authUserId,
            email: 'kimmaree@gmail.com',
            nameFirst: 'kim',
            nameLast: 'maree',
            handleStr: 'kimmaree'
          }
        ]
      });
    });
    test('global owner adds themself', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = channelsCreate(register2.token, 'Birthday Party', true);
      channelInvite(register2.token, channel.channelId, register.authUserId);
      const data = channelAddOwner(register.token, channel.channelId, register.authUserId);
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
  });
});
