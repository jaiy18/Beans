import { authRegister, authLogin, clear } from './serverHelperFunctions';
beforeEach(clear);
afterAll(clear);
describe('/auth/login/v2', () => {
  test('success case', () => {
    authRegister('jai@gmail.com', 'jaibear', 'Jai', 'Bear');
    const login = authLogin('jai@gmail.com', 'jaibear');
    expect(login.authUserId).toStrictEqual(expect.any(Number));
    expect(login.token).toStrictEqual(expect.any(String));
  });
  test('success case, user logs in again', () => {
    authRegister('jai@gmail.com', 'jaibear', 'Jai', 'Bear');
    const login = authLogin('jai@gmail.com', 'jaibear');
    const login2 = authLogin('jai@gmail.com', 'jaibear');
    expect(login2.authUserId).toStrictEqual(login.authUserId);
    expect(login2.token).toStrictEqual(expect.any(String));
  });
  test('Email does not belong to user', () => {
    authRegister('jai@gmail.com', 'jaibear', 'Jai', 'Bear');
    const login = authLogin('ethan@gmail.com', 'jaibear');
    expect(login).toBe(403);
  });
  test('Incorrect password', () => {
    authRegister('jai@gmail.com', 'jaibear', 'Jai', 'Bear');
    const login = authLogin('jai@gmail.com', 'notpassword');
    expect(login).toBe(400);
  });
});
