import { dmCreate, authRegister, dmDetails, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing dmCreate', () => {
  test('dmCreate success with three people', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const register3 = authRegister('isaac.chang@gmail.com', 'isaac123', 'Isaac', 'Chang');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId, register3.authUserId]);
    expect(dm.dmId).toStrictEqual(expect.any(Number));
  });
  test('Empty uIds', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const dm = dmCreate(registerOwner.token, []);
    expect(dm.dmId).toStrictEqual(expect.any(Number));
    const details = dmDetails(registerOwner.token, dm.dmId);
    expect(details).toStrictEqual({
      name: 'ethanphan',
      members: [
        {
          uId: registerOwner.authUserId,
          email: 'ethan.phan@gmail.com',
          nameFirst: 'Ethan',
          nameLast: 'Phan',
          handleStr: 'ethanphan'
        },
      ]
    });
  });
  test('Error: Any uId in uIds does not refer to a valid user', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId, 7]);
    expect(dm).toBe(403);
  });
  test('Error: Duplicate uIds in list', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register1.authUserId, register2.authUserId]);
    expect(dm).toBe(400);
  });
  test('Error: Token is invalid', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token + '1', [register1.authUserId, register2.authUserId]);
    expect(dm).toBe(403);
  });
});
