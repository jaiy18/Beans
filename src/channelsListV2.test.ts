import { channelsCreate, authRegister, channelsList, channelJoin, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing channelList for it-2', () => {
  test('Success: only prints channels user is apart of', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const channel1 = channelsCreate(register1.token, 'channel1', true);
    channelsCreate(register1.token, 'channel2', false);
    channelsCreate(register2.token, 'channel3', false);
    const channel4 = channelsCreate(register2.token, 'channel4', true);
    channelJoin(register3.token, channel1.channelId);
    channelJoin(register3.token, channel4.channelId);
    const list = channelsList(register3.token);
    const channels = [
      { channelId: 0, name: 'channel1' },
      { channelId: 3, name: 'channel4' }
    ];
    expect(list).toMatchObject({ channels });
  });
  test("Testing token which doesn't exist", () => {
    const list = channelsList('DAJSDKASHDKJ');
    expect(list).toBe(403);
  });
});
