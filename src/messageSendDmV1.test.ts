import { dmCreate, authRegister, messageSendDm, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing messageSendDm', () => {
  test('messageSendDm success', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const register3 = authRegister('isaac.chang@gmail.com', 'isaac123', 'Isaac', 'Chang');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId, register3.authUserId]);
    const dmSend = messageSendDm(registerOwner.token, dm.dmId, 'Nine years ago, a nine tailed fox suddenly appeared!');
    expect(dmSend.messageId).toStrictEqual(expect.any(Number));
  });
  test('messageSendDm success one person', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');

    const dm = dmCreate(registerOwner.token, []);
    const dmSend = messageSendDm(registerOwner.token, dm.dmId, 'Nine years ago, a nine tailed fox suddenly appeared!');
    expect(dmSend.messageId).toStrictEqual(expect.any(Number));
  });
  test('error: dmId does not refer to a valid DM', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId]);
    const dmSend = messageSendDm(registerOwner.token, dm.dmId + 1, 'Nine years ago, a nine tailed fox suddenly appeared!');
    expect(dmSend).toBe(403);
  });
  test('error: length of message is greater than 1000 characters', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId]);
    const dmSend = messageSendDm(registerOwner.token, dm.dmId, 'Gkl4h00MPXlVYAkWtMPA7PYe2R5bumQlOyS8DXaQUhOFxwS5DMkCko82aFBOk1kSfFURWFW3KiqvvrIq35N19Jz1KNqN2GYdbDS5iyiT5DQieCvkigQfSfwd6tbt8RX8qCr77YnEk9k4cmHqRod9wnlhLMHmcyRYIAVODHRH7Rluw9bjv42y50B7b3aecr6Bp0Ci8BJScYFFFa2BKwY4orTZJYqueGTt1OgoPAXsIxm4c5c2hT62Sk7aP1kkj4zPN68xIaNYdcMhMzanfwTy8rrBREA6EUPLfoevpFpdrOfZ9UsfME8x8naaNmrmdvqIenLSiNNCoM0SVjSA35s69K94bfMWBtmlSXhHebE7dOAkR2Z4kv6yiG63q2PjZvfmgGJG4YYnK0tkwWAvDW8l634YKJeQv19QtQH45gNWqbuFtYvyb7xxu7EJfNc5KdvGJxIyHTPRVQpwFnTzvHNXheaV9ZYWbctqQk7pGlJTMozY1W5Gq38lnpAZtT1VuOBxBU4wgJoeaInXN9X1OJL8KEkgdolghihCUpD3AYbz4wOwpMWaLl6ifx4HCo2wVyaIU74oAHg2rNmLYRd7ETcs6zYxmJEQf8elY6haEA9RSfpVQfugXF2CcUZ3RjA5K0tL62PJo5pfw8UspQ8sEkU7AkWOHu8K54Ce4Vfq1bRxKNq3nA1zGZ8eVtMRXy6qi6Hg8GDyJ6cfVMPmzn3g6yWZncQZ4APjzdLSD0M6EwPIQaViTK7XrveIRVFaIFP5XDOpKqEAu5QmIunydPVIAb3GqZ0fKz33REXhP6RaceH3QXBa6wg8hDUvbLIXQaJczMJBBW0PS3L4Cz1pH4KkJHFy9TIIrgk95rbaSpR5YXn6mfQzbfD7zU0ofCtzm5WhDBlvNfswXO3ga6B5FR2i3oHDO1G5Gkqjektwu1RY9fhLJRBAFpTNH4Y514dghup9fBPtU0FkrhIgd3pmDDFuOuzCmm9xWzd9fzVuzHv87aerAfYg0WM07eU2J0FHhG5Lq8HwwS88AHYYOmYuuTDqOX1Z3kANFMzaFg8jgtPhHFewf71KmE5yHJwX8xCTeyStds5bO0zzmqJz9pkq');
    expect(dmSend).toBe(400);
  });
  test('error: length of message is less than 1 character', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId]);
    const dmSend = messageSendDm(registerOwner.token, dm.dmId, '');
    expect(dmSend).toBe(400);
  });
  test('error: User is not part of the DM', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const register3 = authRegister('isaac.chang@gmail.com', 'isaac123', 'Isaac', 'Chang');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId]);
    const dmSend = messageSendDm(register3.token, dm.dmId, 'monkey');
    expect(dmSend).toBe(403);
  });
  test('error: Token invalid', () => {
    const registerOwner = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const register1 = authRegister('daniel.guo@gmail.com', 'daneiel123', 'Daniel', 'Guo');
    const register2 = authRegister('Jai.dhawan@gmail.com', 'jai123', 'Jai', 'Dhawan');
    const dm = dmCreate(registerOwner.token, [register1.authUserId, register2.authUserId]);
    const dmSend = messageSendDm('AAAAAAAAAAAAA', dm.dmId, 'monkey');
    expect(dmSend).toBe(403);
  });
});
