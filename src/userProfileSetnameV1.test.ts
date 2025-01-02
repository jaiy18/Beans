import { userProfile, userProfileSetname, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing userProfileSetname for it-2', () => {
  test('Successfully changes name', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    userProfileSetname(user1.token, 'jai', 'dhawan');
    const newUser = userProfile(user1.token, 0);
    expect(newUser).toStrictEqual({
      user: {
        uId: 0,
        email: 'isaacchang@gmail.com',
        nameFirst: 'jai',
        nameLast: 'dhawan',
        handleStr: 'isaacchang'
      }
    });
  });
  test('Invalid Token', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSetname(user1.token + '1', 'jai', 'dhawan');
    expect(change).toBe(403);
  });
  test('Name too short', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSetname(user1.token, '', 'dhawan');
    expect(change).toBe(400);
  });
  test('Name too short', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSetname(user1.token, 'jai', '');
    expect(change).toBe(400);
  });
});
