import { channelsCreate, authRegister, clear } from './serverHelperFunctions';

beforeEach(clear);
// afterAll(clear);
describe('Testing channelsCreate for it-2', () => {
  test('Successful channel creation', () => {
    const register = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const data = channelsCreate(register.token, 'channelNew', true);
    expect(data).toStrictEqual({ channelId: 0 });
  });
  test('Channel name already exist', () => {
    const register = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    channelsCreate(register.token, 'channelNew', true);
    const channel2 = channelsCreate(register.token, 'channelNew', true);
    expect(channel2).toStrictEqual({ error: 'Channel name already exists' });
  });
  test('Invalid token', () => {
    const channel1 = channelsCreate('KDKAJDSLKAJD', 'channelNew', true);
    expect(channel1).toBe(403);
  });
  test('Channel name is too long', () => {
    const register = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const channel1 = channelsCreate(register.token, 'channelNew123457890098765432', true);
    expect(channel1).toBe(400);
  });
  test('Channel name is too short', () => {
    const register = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const channel1 = channelsCreate(register.token, '', true);
    expect(channel1).toBe(400);
  });
  test('Multiple channels created from different users', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'Ethan', 'Phan');
    const user2 = authRegister('isaac.chang@gmail.com', 'isaac123', 'Isaac', 'Chang');
    const user3 = authRegister('prith.singh@gmail.com', 'prith123', 'Prith', 'Singh');
    channelsCreate(user1.token, 'ethanchannel', true);
    channelsCreate(user2.token, 'isaacchannel', true);
    const channel3 = channelsCreate(user3.token, 'prithchannel', true);
    expect(channel3).toStrictEqual({ channelId: 2 });
  });
});
