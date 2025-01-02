import { authRegister, clear, authPasswordResetRequestV1 } from './serverHelperFunctions';
beforeEach(clear);
afterAll(clear);
describe('/auth/passwordreset/request/v1', () => {
  test('success case', () => {
    authRegister('z5419207@ad.unsw.edu.au', 'jaibear', 'Jai', 'Bear');
    const reset = authPasswordResetRequestV1('z5419207@ad.unsw.edu.au');
    expect(reset).toStrictEqual({});
  });
  test('success case', () => {
    authRegister('jaidhawan2@gmail.com', 'jaibear', 'Jai', 'Bear');
    const reset = authPasswordResetRequestV1('jaidhawan2@gmail.com');
    expect(reset).toStrictEqual({});
  });
  test('invalid email', () => {
    authRegister('jaidhawan2@gmail.com', 'jaibear', 'Jai', 'Bear');
    const reset = authPasswordResetRequestV1('shfsfhksdfkalfa');
    expect(reset).toStrictEqual({});
  });
});
