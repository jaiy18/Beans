import {
  channelsCreate, authRegister, usersStats, clear, messageSend, messageSendDm, dmCreate, messageSendLater, dmRemove, messageSendLaterDm
} from './serverHelperFunctions';

beforeEach(clear);
// afterAll(clear);

describe('Tests for workspaceStats', () => {
  test('Empty channels and dm', () => {
    const user = authRegister('jaidhawan2@gmail.com', '123145423', 'jai', 'jai');
    const stats = usersStats(user.token);
    expect(stats.workspaceStats.utilizationRate).toBe(0);
  });
  test('One channel', () => {
    const user = authRegister('jaidhawan2@gmail.com', '123145423', 'jai', 'jai');
    authRegister('ethan2@gmail.com', '123468648', 'ethan', 'phan');
    authRegister('isaac@gmail.com', '154531313', 'isaac', 'chang');
    const channel = channelsCreate(user.token, 'chashdkjad', true);
    let wait = Date.now() + 3 * 1000;
    let time = Math.floor(Date.now() / 1000);
    const dm1 = dmCreate(user.token, [1, 2]);
    messageSend(user.token, 0, 'hello');
    messageSendDm(user.token, 0, 'hi');
    messageSendLaterDm(user.token, dm1.dmId, 'hello', time + 2);
    while (Date.now() < wait) {
      continue;
    }
    time = Math.floor(Date.now() / 1000);
    wait = Date.now() + 3 * 1000;
    while (Date.now() < wait) {
      continue;
    }
    messageSendLater(user.token, channel.channelId, 'hello', time + 2);
    dmRemove(user.token, dm1.dmId);
    const stats = usersStats(user.token);
    expect(stats.workspaceStats.utilizationRate).toBe(0.3333333333333333);
  });
});
