import { authRegister, clear, authPasswordResetRequestV1, authPasswordResetResetV1 } from './serverHelperFunctions';
beforeEach(clear);
afterAll(clear);

describe('/auth/passwordreset/reset/v1', () => {
  test('success case', () => {
    // authRegister('z5419207@ad.unsw.edu.au', 'jaibear', 'Jai', 'Bear');
    // authPasswordResetRequestV1('z5419207@ad.unsw.edu.au');
    // const reset = authPasswordResetResetV1(expect.any(String), 'popopopo');
    // expect(reset).toStrictEqual({});
  });
  test('bad password', () => {
    authRegister('jaidhawan2@gmail.com', 'jaibear', 'Jai', 'Bear');
    authPasswordResetRequestV1('jaidhawan2@gmail.com');
    const reset = authPasswordResetResetV1('HELP', 'po');
    expect(reset).toBe(400);
  });
  test('invalid code', () => {
    authRegister('jaidhawan2@gmail.com', 'jaibear', 'Jai', 'Bear');
    authPasswordResetRequestV1('jaidhawan2@gmail.com');
    const reset = authPasswordResetResetV1('HELPDSADADADDASDs', '12345678');
    expect(reset).toBe(400);
  });
});
