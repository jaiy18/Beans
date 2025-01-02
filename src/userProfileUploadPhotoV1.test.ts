import { authRegister, clear, userProfileUploadPhoto } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

const url = 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/little-cute-maltipoo-puppy-royalty-free-image-1652926025.jpg?crop=0.444xw:1.00xh;0.129xw,0&resize=980:*';
const invalidUrl = '//hips.hearstapps.comprod.s3.amazonaws.cages/little-cuteipoo-puppy-royalty-image-1652926025.jrop=0.444x0xh;0.129xw,0&resize=980:*';
const jpeg = 'https://images.pexels.com/photos/235986/pexels-photo-235986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

describe('/user/profile/uploadphoto', () => {
  test('success', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const success = userProfileUploadPhoto(reg.token, url, 10, 10, 12, 35);
    expect(success).toStrictEqual({});
  });
  test('token invalid', () => {
    authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto('jaiisacooldude', url, 10, 10, 12, 35);
    expect(fail).toBe(403);
  });
  test('xEnd is less than xStart', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, url, 10, 10, 7, 35);
    expect(fail).toBe(400);
  });
  test('yEnd is less than yStart', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, url, 10, 10, 15, 6);
    expect(fail).toBe(400);
  });
  test('xStart < 0', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, url, -1, 10, 7, 35);
    expect(fail).toBe(400);
  });
  test('yStart < 0', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, url, 10, -1, 12, 35);
    expect(fail).toBe(400);
  });
  test('xEnd out of bounds', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, url, 10, 10, 10000000000000, 35);
    expect(fail).toBe(400);
  });
  test('yEnd out of bounds', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, url, 10, 10, 12, 10000);
    expect(fail).toBe(400);
  });
  test('not a JPG', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, jpeg, 10, 10, 12, 10000);
    expect(fail).toBe(400);
  });
  test('url invalid', () => {
    const reg = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = userProfileUploadPhoto(reg.token, invalidUrl, 10, 10, 12, 13);
    expect(fail).toBe(400);
  });
});
