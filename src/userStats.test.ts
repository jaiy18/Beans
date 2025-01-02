import { dmCreate, authRegister, clear, channelsCreate, messageSend, userStats, messageSendDm, channelJoin, channelLeave, dmLeave } from './serverHelperFunctions';

beforeEach(() => {
  clear();
});

describe('Testing /user/stats/v1', () => {
  test('Testing if error is returned when token is invalid', () => {
    const stat = userStats('invalid-token');
    expect(stat).toBe(403);
  });

  test('Testing if user stats are returned correctly', () => {
    const user1 = authRegister('jaidhawan@gmail.com', 'jaidsdadasd', 'jai', 'dhawan');
    const user2 = authRegister('isaac@gmail.com', 'isadfdfdfac', 'isaac', 'chang');
    const user3 = authRegister('jjhgjgjghj@gmail.com', 'addfajdad', 'jerald', 'jose');
    const channel1 = channelsCreate(user1.token, 'whwarhw', true);
    const user1stats = userStats(user1.token);
    expect(user1stats.userStats.channelsJoined.length).toBe(2);

    const channelId2 = channelsCreate(user1.token, 'channel2', true);

    const dm1 = dmCreate(user1.token, [1]);
    const dm2 = dmCreate(user1.token, [1, 2]);

    messageSend(user1.token, channelId2.channelId, 'agsdfg');
    messageSend(user1.token, channelId2.channelId, 'POPP');
    messageSend(user1.token, channelId2.channelId, 'MeBHHUe');

    channelJoin(user2.token, channel1.channelId);

    messageSend(user2.token, channel1.channelId, 'Mkjshf');
    messageSend(user2.token, channel1.channelId, 'FUCK');

    channelLeave(user2.token, channel1.channelId);
    dmLeave(user2.token, dm2.dmId);

    let data1 = userStats(user1.token);
    let data2 = userStats(user2.token);
    let data3 = userStats(user3.token);

    expect(data1.userStats.channelsJoined.length).toBe(3);
    expect(data2.userStats.dmsJoined.length).toStrictEqual(4);
    expect(data1.userStats.messagesSent.length).toStrictEqual(4);
    expect(data1.userStats.involvementRate).toStrictEqual(1);

    messageSendDm(user2.token, dm1.dmId, 'JJAHOE');
    messageSendDm(user2.token, dm1.dmId, 'JJAHOE');
    messageSendDm(user2.token, dm1.dmId, 'JJAHOE');

    messageSendDm(user1.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user1.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user1.token, dm2.dmId, 'JJAHOE');

    messageSendDm(user2.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user2.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user2.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user3.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user3.token, dm2.dmId, 'JJAHOE');
    messageSendDm(user3.token, dm2.dmId, 'JJAHOE');

    data1 = userStats(user1.token);
    data2 = userStats(user2.token);
    data3 = userStats(user3.token);
    // console.log(data3);

    expect(data1.userStats.messagesSent.length).toStrictEqual(7);
    expect(data2.userStats.messagesSent.length).toStrictEqual(6);
    expect(data3.userStats.messagesSent.length).toStrictEqual(4);
  });
  test('Involement rate of 0', () => {
    const user1 = authRegister('jaidhawan@gmail.com', 'jaidsdadasd', 'jai', 'dhawan');
    const user = userStats(user1.token);
    expect(user.userStats.involvementRate).toBe(0);
  });
});
