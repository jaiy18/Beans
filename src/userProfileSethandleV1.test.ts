import { userProfile, userProfileSethandle, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing userProfileSethandle for it-2', () => {
  test('Successfully changes handle', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    userProfileSethandle(user1.token, 'isaac2345');
    const newUser = userProfile(user1.token, user1.authUserId);
    expect(newUser).toStrictEqual({
      user: {
        uId: user1.authUserId,
        email: 'isaacchang@gmail.com',
        nameFirst: 'isaac',
        nameLast: 'chang',
        handleStr: 'isaac2345'
      }
    });
  });
  test('Invalid Token', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSethandle(user1.token + '1', 'issac2344');
    expect(change).toBe(403);
  });
  test('Invalid Handle - length short', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSethandle(user1.token, '');
    expect(change).toBe(400);
  });
  test('Invalid Handle - length long', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSethandle(user1.token, 'ffffffffffffffffffffffffffffffffffffffffff');
    expect(change).toBe(400);
  });
  test('Invalid Handle - !alphanumeric', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSethandle(user1.token, 'isac@434 )(*&^%$!34');
    expect(change).toBe(400);
  });
  test('Handle is already in use', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    authRegister('jaidhawan@gmail.com', 'isaac123', 'iasdasa', 'chang');
    const change = userProfileSethandle(user1.token, 'iasdasachang');
    expect(change).toBe(400);
  });
});
