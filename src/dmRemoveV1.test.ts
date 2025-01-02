import { authRegister, dmCreate, dmRemove, dmLeave, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing dmRemoveV1 for it-2', () => {
  test('Success: removes dm', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const remove = dmRemove(register1.token, dm1.dmId);
    expect(remove).toStrictEqual({});
  });

  test('dmId is invalid', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    dmCreate(register1.token, [register2.authUserId]);
    const remove = dmRemove(register1.token, -1);
    expect(remove).toBe(400);
  });
  test('dmId is valid and the authorised user is not the original DM creator', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    const remove = dmRemove(register2.token, dm1.dmId);
    expect(remove).toBe(403);
  });
  test('token is invalid', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const dm1 = dmCreate(register1.token, []);
    const remove = dmRemove(register1.token + '1', dm1.dmId);
    expect(remove).toBe(403);
  });

  test('user no longer member of dm', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const dm1 = dmCreate(register1.token, [register2.authUserId]);
    dmLeave(register2.token, dm1.dmId);
    const remove = dmRemove(register2.token, dm1.dmId);
    expect(remove).toBe(403);
  });
});
