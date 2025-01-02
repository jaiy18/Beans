import { userProfile, userProfileSetemail, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing userProfileSetemail for it-2', () => {
  test('Successfully changes email', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    userProfileSetemail(user1.token, 'jaidhawan@gmail.com');
    const newUser = userProfile(user1.token, 0);
    expect(newUser).toStrictEqual({
      user: {
        uId: 0,
        email: 'jaidhawan@gmail.com',
        nameFirst: 'isaac',
        nameLast: 'chang',
        handleStr: 'isaacchang'
      }
    });
  });
  test('Invalid Token', () => {
    authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSetemail('SADNASKLDNA', 'jaidhawan@gmail.com');
    expect(change).toBe(403);
  });
  test('Invalid Email', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    const change = userProfileSetemail(user1.token, 'jaiadasdadadad');
    expect(change).toBe(400);
  });
  test('Email is already in use', () => {
    const user1 = authRegister('isaacchang@gmail.com', 'isaac123', 'isaac', 'chang');
    authRegister('jaidhawan@gmail.com', 'isaac123', 'iasdasa', 'chang');
    const change = userProfileSetemail(user1.token, 'jaidhawan@gmail.com');
    expect(change).toBe(400);
  });
});
