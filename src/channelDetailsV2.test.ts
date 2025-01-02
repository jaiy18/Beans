import { channelsCreate, authRegister, channelDetails, clear } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);
describe('Testing channelDetails for it-2', () => {
  test('Printing Valid info', () => {
    const user1 = authRegister('ethan.phan@gmail.com', 'ethan123', 'ethan', 'phan');
    channelsCreate(user1.token, 'channel1', true);
    const details = channelDetails(user1.token, 0);
    expect(details).toStrictEqual(
      {
        name: 'channel1',
        isPublic: true,
        ownerMembers: [{
          uId: 0,
          email: 'ethan.phan@gmail.com',
          nameFirst: 'ethan',
          nameLast: 'phan',
          handleStr: 'ethanphan'

        }],
        allMembers: [{
          uId: 0,
          email: 'ethan.phan@gmail.com',
          nameFirst: 'ethan',
          nameLast: 'phan',
          handleStr: 'ethanphan'
        }]
      });
  });
  test('Checking if duplicate names handled', () => {
    authRegister('ethan.phan@gmail.com', 'ethan123', 'ethan', 'phan');
    const user2 = authRegister('ethan.phan1@gmail.com', 'ethan123', 'ethan', 'phan');
    const user2Details = { uId: 1, email: 'ethan.phan1@gmail.com', nameFirst: 'ethan', nameLast: 'phan', handleStr: 'ethanphan0' };
    channelsCreate(user2.token, 'channel1', true);
    const details = channelDetails(user2.token, 0);
    expect(details.allMembers).toContainEqual(user2Details);
  });
  test('channelId is not valid', () => {
    const user1 = authRegister('anya1@gmail.com', 'anyaya', 'anya', 'forger');
    channelsCreate(user1.token, 'channel1', true);
    const details = channelDetails(user1.token, 9999);
    expect(details).toBe(400);
  });
  test('Token is not valid', () => {
    const user1 = authRegister('anya@gmail.com', 'anyaya', 'anya', 'forger');
    channelsCreate(user1.token, 'channel1', true);
    const details = channelDetails('DSADSKJJKA', 0);
    expect(details).toBe(403);
  });
  test('User is not in the channel', () => {
    const user1 = authRegister('yor@gmail.com', 'loidforger567', 'yor', 'forger');
    const user2 = authRegister('loid@gmail.com', 'yorforger890', 'loid', 'forger');
    channelsCreate(user1.token, 'channel1', true);
    channelsCreate(user2.token, 'channel2', true);
    const details = channelDetails(user2.token, 0);
    expect(details).toBe(403);
  });
});
