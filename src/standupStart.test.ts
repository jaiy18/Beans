import { channelsCreate, authRegister, standupStart, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing standupStart for it-3', () => {
  test('success', () => {
    const wait = Date.now() + 2 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupStart(register1.token, channel1.channelId, 1);
    expect(standStart.timeFinish).toBeCloseTo(Math.floor(Date.now() / 1000) + 1, 2);
    while (Date.now() < wait) {
      continue;
    }
  });

  test('success', () => {
    let wait = Date.now() + 2 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 1);
    while (Date.now() < wait) {
      continue;
    }
    wait = Date.now() + 2 * 1000;
    const standStart = standupStart(register1.token, channel1.channelId, 1);
    expect(standStart.timeFinish).toBeCloseTo(Math.floor(Date.now() / 1000) + 1, 2);
    while (Date.now() < wait) {
      continue;
    }
  });

  test('Invalid token', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupStart('jncakjdcnskjsdcsdcsdc', channel1.channelId, 1);
    expect(standStart).toBe(403);
  });

  test('Incorrect channelId', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupStart(register1.token, 2, 1);
    expect(standStart).toBe(400);
  });

  test('negative length', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupStart(register1.token, channel1.channelId, -1);
    expect(standStart).toBe(400);
  });

  test('Already active', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 1);
    const standStart2 = standupStart(register1.token, channel1.channelId, 1);
    expect(standStart2).toBe(400);
  });

  test('not authorised user', () => {
    const wait = Date.now() + 2 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupStart(register2.token, channel1.channelId, 1);
    expect(standStart).toBe(403);
    while (Date.now() < wait) {
      continue;
    }
  });
});
