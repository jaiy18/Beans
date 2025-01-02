import { authRegister, adminUserRemove, adminUserPermissionChange, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('admin/userpermission/change/v1', () => {
  test('Success', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const regMem = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const regMem2 = authRegister('danielguo@gmail.com', 'daniel123', 'daniel', 'guo');
    const fail = adminUserRemove(regMem.token, regOwn.authUserId);
    expect(fail).toBe(403);
    const change = adminUserPermissionChange(regOwn.token, regMem.authUserId, 1);
    expect(change).toStrictEqual({});
    const success = adminUserRemove(regMem.token, regMem2.authUserId);
    expect(success).toStrictEqual({});
  });
  test('uId does not refer to a valid user', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const regMem = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const change = adminUserPermissionChange(regOwn.token, regMem.authUserId + 1, 1);
    expect(change).toBe(400);
  });
  test('uId refers to a user who is the only global owner and they are being demoted to a user', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const change = adminUserPermissionChange(regOwn.token, regOwn.authUserId, 2);
    expect(change).toBe(400);
  });
  test('The user has the permissions level of permissionId', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const regMem = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const regMem2 = authRegister('danielguo@gmail.com', 'daniel123', 'daniel', 'guo');
    adminUserPermissionChange(regOwn.token, regMem2.authUserId, 1);
    const change1 = adminUserPermissionChange(regOwn.token, regMem2.authUserId, 1);
    const change2 = adminUserPermissionChange(regOwn.token, regMem.authUserId, 2);
    expect(change1).toBe(400);
    expect(change2).toBe(400);
  });
  test('The authorised user is not a global owner', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const regMem = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = adminUserPermissionChange(regMem.token, regOwn.authUserId, 2);
    expect(fail).toBe(403);
  });
  test('Token invalid', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const fail = adminUserPermissionChange(regOwn.token + 'abc', regOwn.authUserId, 2);
    expect(fail).toBe(403);
  });
  test('permission invalid', () => {
    const regOwn = authRegister('ethanphan@gmail.com', 'ethan123', 'ethan', 'phan');
    const regMem = authRegister('jaidhawan@gmail.com', 'jai123', 'jai', 'dhawan');
    const fail = adminUserPermissionChange(regOwn.token, regMem.authUserId, 5);
    expect(fail).toBe(400);
    const fail2 = adminUserPermissionChange(regOwn.token, regMem.authUserId, 0);
    expect(fail2).toBe(400);
  });
});
