import {
  clear, authRegister, channelsCreate, messageEdit,
  messageSend, notificationsGet, channelJoin, dmCreate, messageSendDm
} from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Test success', () => {
  test('successful case - tag message', () => {
    const user1 = authRegister('jai@gmail.com', 'jai1234', 'jai', 'dhawan');
    const user2 = authRegister('ethan@gmail.com', 'ethan1234', 'ethan', 'phan');
    const channel = channelsCreate(user1.token, 'channel', true);
    channelJoin(user2.token, channel.channelId);
    messageSend(user1.token, channel.channelId, 'hi@ethanphan! how are you?');
    const notifications2 = notificationsGet(user2.token);
    expect(notifications2).toStrictEqual({
      notifications: [
        {
          channelId: channel.channelId,
          dmId: -1,
          notificationMessage: 'jaidhawan tagged you in channel: hi@ethanphan! how ar'
        }
      ]
    });
    const notifications1 = notificationsGet(user1.token);
    expect(notifications1).toStrictEqual({
      notifications: []
    });
  });

  // test('successful case - tag message edit', () => {
  //   const user1 = authRegister('jai@gmail.com', 'ethan1234', 'jai', 'dhawan');
  //   const user2 = authRegister('ethan@gmail.com', 'jai123456', 'ethan', 'phan');
  //   const channel = channelsCreate(user1.token, 'channel1', true);
  //   channelJoin(user2.token, channel.channelId);
  //   const message = messageSend(user1.token, channel.channelId, 'fatty');
  //   messageEdit(user1.token, message.messageId, '@ethanphan! yourFAT');
  //   const notifications2 = notificationsGet(user2.token);
  //   const notifications1 = notificationsGet(user1.token);
  //   expect(notifications2).toStrictEqual({
  //     notifications: [
  //       {
  //         channelId: channel.channelId,
  //         dmId: -1,
  //         notificationMessage: 'jaidhawan tagged you in channel1: @ethanphan! yourFAT'
  //       }
  //     ]
  //   });
  //   expect(notifications1).toStrictEqual({
  //     notifications: []
  //   });
  // });
  test('dm messages', () => {
    const user1 = authRegister('jai@gmail.com', 'ethan1234', 'jai', 'dhawan');
    const user2 = authRegister('ethan@gmail.com', 'jai123456', 'ethan', 'phan');
    const dm1 = dmCreate(user1.token, [1]);
    messageSendDm(user2.token, dm1.dmId, '@jaidhawan you are fat');
    const notif = notificationsGet(user2.token);
    expect(notif).toStrictEqual({
      notifications: [
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'ethanphan tagged you in ethanphan, jaidhawan: @jaidhawan you are f'
        },
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'jaidhawan added you to ethanphan, jaidhawan'
        }
      ]
    });
  });
  test('token invalid', () => {
    const user1 = authRegister('jai@gmail.com', 'ethan1234', 'jai', 'dhawan');
    const notif = notificationsGet(user1.token + 'abc');
    expect(notif).toEqual(403);
  });
  test('successful case - dm message edit', () => {
    const user1 = authRegister('jai@gmail.com', 'ethan1234', 'jai', 'dhawan');
    const user2 = authRegister('ethan@gmail.com', 'jai123456', 'ethan', 'phan');
    const dm1 = dmCreate(user1.token, [1]);
    const message = messageSendDm(user1.token, dm1.dmId, 'fatty');
    messageEdit(user1.token, message.messageId, '@ethanphan! yourFAT');
    const notif2 = notificationsGet(user2.token);
    expect(notif2).toStrictEqual({
      notifications: [
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'jaidhawan tagged you in ethanphan, jaidhawan: @ethanphan! yourFAT'
        },
        {
          channelId: -1,
          dmId: dm1.dmId,
          notificationMessage: 'jaidhawan added you to ethanphan, jaidhawan'
        }
      ]
    });
  });
});
