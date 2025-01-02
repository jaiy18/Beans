import { dmCreate, dmLeave, dmDetails, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing dmLeave it-2', () => {
  test('dmLeave Success', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const user2 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    dmCreate(user1.token, [user2.authUserId]);
    dmLeave(user1.token, 0);
    const details = dmDetails(user1.token, 0);
    expect(details).toBe(403);
  });
  test('User not in dm', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const user2 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    dmCreate(user1.token, []);
    dmCreate(user2.token, []);
    const leave = dmLeave(user2.token, 0);
    expect(leave).toBe(403);
  });
  test('Invalid token', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    dmCreate(user1.token, []);
    const leave = dmLeave('SFADAJALK', 0);
    expect(leave).toBe(403);
  });
  test('Invalid dm', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    dmCreate(user1.token, []);
    const leave = dmLeave(user1.token, 3);
    expect(leave).toBe(400);
  });
});
