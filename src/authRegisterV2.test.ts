import { authRegister, clear } from './serverHelperFunctions';
beforeEach(clear);
afterAll(clear);

describe('/auth/register/v2', () => {
  test('success', () => {
    const reg = authRegister('jai@gmail.com', 'jaibear', 'Jai', 'Bear');
    expect(reg.authUserId).toStrictEqual(expect.any(Number));
    expect(reg.token).toStrictEqual(expect.any(String));
  });
  test('shorten a handleStr', () => {
    const reg = authRegister('jai@gmail.com', 'jaibear', 'Jaiisarealycoolcolldudeyknow', 'Superddefjdwoiwocoat');
    expect(reg.authUserId).toStrictEqual(expect.any(Number));
    expect(reg.token).toStrictEqual(expect.any(String));
  });
  test('Email is not valid', () => {
    const reg = authRegister('jai@@@@%$&*^gmail.com', 'jaibear', 'Jai', 'Bear');
    expect(reg).toBe(403);
  });
  test('Email already in use', () => {
    authRegister('jai@gmail.com', 'jaibear', 'Jai', 'Bear');
    const reg = authRegister('jai@gmail.com', 'cow12234', 'ethan', 'phan');
    expect(reg).toBe(403);
  });
  test('Password less than 6 characters', () => {
    const reg = authRegister('jai@gmail.com', '', 'ethan', 'phan');
    expect(reg).toBe(400);
  });
  test('First name less than 1 character', () => {
    const reg = authRegister('jai@gmail.com', 'jai123', '', 'phan');
    expect(reg).toBe(400);
  });
  test('First name greater than 50 characters', () => {
    const reg = authRegister('jai@gmail.com', 'jai123', 'Peter Piper picked a peck of pickled peppers. A peck', 'phan');
    expect(reg).toBe(400);
  });
  test('Last name less than 1 character', () => {
    const reg = authRegister('jai@gmail.com', 'jai123', 'ethan', '');
    expect(reg).toBe(400);
  });
  test('Last name greater than 50 character', () => {
    const reg = authRegister('jai@gmail.com', 'jai123', 'ethan', 'Peter Piper picked a peck of pickled peppers. A peck');
    expect(reg).toBe(400);
  });
});
