import { userProfile, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/user/profile/v2', () => {
  describe('errors', () => {
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = userProfile(register.token + '1', register.authUserId);
      expect(data).toEqual(403);
    });
    test('uId is not valid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = userProfile(register.token, -1);
      expect(data).toEqual(400);
    });
  });
  describe('success cases', () => {
    test('user gets profile of themself', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const data = userProfile(register.token, register.authUserId);
      expect(data).toStrictEqual(
        {
          user: {
            uId: register.authUserId,
            email: 'eloise@gmail.com',
            nameFirst: 'eloise',
            nameLast: 'pozzi',
            handleStr: 'eloisepozzi'
          }
        }
      );
    });
    test('user gets profile of another user', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = authRegister('eloisekelly@gmail.com', 'chocolate', 'eloise', 'kelly');
      const data = userProfile(register.token, register2.authUserId);
      expect(data).toStrictEqual({
        user: {
          uId: register2.authUserId,
          email: 'eloisekelly@gmail.com',
          nameFirst: 'eloise',
          nameLast: 'kelly',
          handleStr: 'eloisekelly'
        }
      });
    });
  });
});
