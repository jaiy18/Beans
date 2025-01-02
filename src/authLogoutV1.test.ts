import { userProfile, authRegister, authLogout, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('/auth/logout/v1', () => {
  describe('errors', () => {
    test('token is invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const logout = authLogout(register.token + '1');
      expect(logout).toEqual(403);
    });
  });
  describe('success', () => {
    test('after logging out, test that token is now invalid', () => {
      const register = authRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const logout = authLogout(register.token);
      expect(logout).toStrictEqual({});
      const data = userProfile(register.token, register.authUserId);
      expect(data).toEqual(403);
    });
  });
});
