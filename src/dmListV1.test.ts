import { dmCreate, dmList, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing dmList it-2', () => {
  test('dmList Success', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const user2 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const user3 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const user4 = authRegister('isaac.chang@gmail.com', 'isaac123', 'Isaac', 'Chang');
    dmCreate(user1.token, [user2.authUserId, user3.authUserId, user4.authUserId]);
    dmCreate(user1.token, [user2.authUserId, user4.authUserId]);
    dmCreate(user1.token, [user2.authUserId, user3.authUserId]);
    const list = dmList(user2.token);
    expect(list).toStrictEqual({
      dms: [
        {
          dmId: 0,
          name: 'danielguo, ethanphan, isaacchang, jaidhawan'
        },
        {
          dmId: 1,
          name: 'danielguo, ethanphan, isaacchang'
        },
        {
          dmId: 2,
          name: 'danielguo, ethanphan, jaidhawan'
        }
      ]
    });
  });
  test('Invalid token', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const user2 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    dmCreate(user1.token, [user2.authUserId]);
    const list = dmList('DAJSHDKJSHAKD');
    expect(list).toBe(403);
  });
});
