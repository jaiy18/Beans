import { channelsCreate, authRegister, standupStart, standupSend, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing standupStart for it-3', () => {
  test('success: active', () => {
    const wait = Date.now() + 3 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 1);
    const standSend = standupSend(register1.token, channel1.channelId, 'one');
    expect(standSend).toStrictEqual({});
    while (Date.now() < wait) {
      continue;
    }
  });

  test('Invalid token', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standStart = standupSend('jncakjdcnskjsdcsdcsdc', channel1.channelId, 'one');
    expect(standStart).toBe(403);
  });

  test('Incorrect channelId', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 2);
    const standSend = standupSend(register1.token, 2, 'one');
    expect(standSend).toBe(400);
  });

  test('length of message', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 2);
    const standSend = standupSend(register1.token, channel1.channelId, `QWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOP
    QWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPQWERTYUIOPASCSXSXHJSXHSJXHJSHX
    JSNXJNJNJXSNXJSNXJSNXJSNXSXBJHSBCSJHCBSJCBHJSBCJHSBCHJSBCJHSBCJHSBCHBSJHBCSJHBCSJHBCHSJB`);
    expect(standSend).toBe(400);
  });

  test('no active standup', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    const standSend = standupSend(register1.token, channel1.channelId, 'one');
    expect(standSend).toBe(400);
  });
  test('not authorised', () => {
    const wait = Date.now() + 3 * 1000;
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const channel1 = channelsCreate(register1.token, 'channelOne', true);
    standupStart(register1.token, channel1.channelId, 2);
    const standSend = standupSend(register2.token, channel1.channelId, 'one');
    expect(standSend).toBe(403);
    while (Date.now() < wait) {
      continue;
    }
  });
});
