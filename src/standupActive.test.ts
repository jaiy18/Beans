import { channelsCreate, authRegister, standupStart, standupActive, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing standupStart for it-3', () => {
  test('success: active', () => {
    const wait = Date.now() + 3 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupStart(register1.token, channel1.channelId, 2);
    const standActive = standupActive(register1.token, channel1.channelId);
    expect(standActive).toStrictEqual({
      isActive: true,
      timeFinish: standStart.timeFinish
    });
    while (Date.now() < wait) {
      continue;
    }
  });
  test('success: unactive', () => {
    const wait = Date.now() + 3 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standActive = standupActive(register1.token, channel1.channelId);
    expect(standActive).toStrictEqual({
      isActive: false,
      timeFinish: null
    });
    while (Date.now() < wait) {
      continue;
    }
  });
  test('Invalid token', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupActive('jncakjdcnskjsdcsdcsdc', channel1.channelId);
    expect(standStart).toBe(403);
  });
  test('Incorrect channelId', () => {
    const wait = Date.now() + 3 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 2);
    const standActive = standupActive(register1.token, 4);
    expect(standActive).toBe(400);
    while (Date.now() < wait) {
      continue;
    }
  });
  test('not authorised user', () => {
    const wait = Date.now() + 3 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 2);
    const standActive = standupActive(register2.token, channel1.channelId);
    expect(standActive).toBe(403);
    while (Date.now() < wait) {
      continue;
    }
  });
});
