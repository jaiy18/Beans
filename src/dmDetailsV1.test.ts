import { authRegister, dmCreate, dmDetails, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing dmDetailsV1 for it-2', () => {
  test('Success: prints dm details', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const dm1 = dmCreate(register1.token, [register2.authUserId, register3.authUserId]);
    const details = dmDetails(register1.token, dm1.dmId);
    expect(details).toStrictEqual({
      name: 'persona, personb, personc',
      members: [
        {
          uId: register1.authUserId,
          email: 'person1@gmail.com',
          nameFirst: 'person',
          nameLast: 'a',
          handleStr: 'persona'
        },
        {
          uId: register2.authUserId,
          email: 'person2@gmail.com',
          nameFirst: 'person',
          nameLast: 'b',
          handleStr: 'personb'
        },
        {
          uId: register3.authUserId,
          email: 'person3@gmail.com',
          nameFirst: 'person',
          nameLast: 'c',
          handleStr: 'personc'
        }
      ]
    });
  });

  test('dmId invalid', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const details = dmDetails(register1.token, -1);
    expect(details).toBe(400);
  });
  test('dmId is valid and the authorised user is not a member of the DM', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const details = dmDetails(register3.token, dm1.dmId);
    expect(details).toBe(403);
  });
  test('Invalid token', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const details = dmDetails(register1.token + '1', dm1.dmId);
    expect(details).toBe(403);
  });
});
