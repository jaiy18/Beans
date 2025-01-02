import { channelsCreate, authRegister, channelsListAll, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing channelListAll for it-2', () => {
  test('Success: lists all channels as objects', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    channelsCreate(register1.token, 'channel1', true);
    channelsCreate(register1.token, 'channel2', false);
    channelsCreate(register2.token, 'channel3', false);
    channelsCreate(register2.token, 'channel4', true);
    const list = channelsListAll(register1.token);
    const channels = [
      { channelId: 0, name: 'channel1' },
      { channelId: 1, name: 'channel2' },
      { channelId: 2, name: 'channel3' },
      { channelId: 3, name: 'channel4' }
    ];
    expect(list).toStrictEqual({ channels });
  });

  test("Testing token which doesn't exist", () => {
    const list = channelsListAll('DAJSDKASHDKJ');
    expect(list).toBe(403);
  });
});
