import { usersAll, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing usersAll it-2', () => {
  test('Token is invalid', () => {
    const user1 = authRegister('ethan@ad.unsw.edu.au', 'eth123', 'ethan', 'phan');
    // const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const users = usersAll(user1.token + '1');
    expect(users).toBe(403);
  });
  test('Printing all users', () => {
    const user1 = authRegister('ethan@ad.unsw.edu.au', 'eth123', 'ethan', 'phan');
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const users = usersAll(user1.token);
    expect(users).toStrictEqual({
      users:
        [{
          uId: user1.authUserId,
          email: 'ethan@ad.unsw.edu.au',
          nameFirst: 'ethan',
          nameLast: 'phan',
          handleStr: 'ethanphan'
        },
        {
          uId: user2.authUserId,
          email: 'hay@ad.unsw.edu.au',
          nameFirst: 'hay',
          nameLast: 'hay',
          handleStr: 'hayhay'
        }]
    });
  });
});
