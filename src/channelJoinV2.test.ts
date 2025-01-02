import { channelsCreate, authRegister, channelJoin, clear, channelDetails } from './serverHelperFunctions';

beforeEach(clear);
afterAll(clear);

describe('Testing channelJoin for it-2', () => {
  test('Authorised user has successfully joined channel', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const channel1: any = channelsCreate(register1.token, 'person1channel', true);
    channelJoin(register2.token, channel1.channelId);
    channelJoin(register3.token, channel1.channelId);
    const details = channelDetails(register1.token, channel1.channelId);
    expect(details).toStrictEqual({
      name: 'person1channel',
      isPublic: true,
      ownerMembers: [
        {
          uId: 0,
          email: 'person1@gmail.com',
          nameFirst: 'person',
          nameLast: 'a',
          handleStr: 'persona'
        }
      ],
      allMembers: [
        {
          uId: 0,
          email: 'person1@gmail.com',
          nameFirst: 'person',
          nameLast: 'a',
          handleStr: 'persona'
        },
        {
          uId: 1,
          email: 'person2@gmail.com',
          nameFirst: 'person',
          nameLast: 'b',
          handleStr: 'personb'
        },
        {
          uId: 2,
          email: 'person3@gmail.com',
          nameFirst: 'person',
          nameLast: 'c',
          handleStr: 'personc'
        }
      ]
    });
  });

  test('global owner has successfully joined channel', () => {
    const register1 = authRegister('person1@gmail.com', 'person1pass', 'person', 'a');
    const register2 = authRegister('person2@gmail.com', 'person2pass', 'person', 'b');
    const register3 = authRegister('person3@gmail.com', 'person3pass', 'person', 'c');
    const channel1: any = channelsCreate(register2.token, 'person2channel', false);
    channelJoin(register1.token, channel1.channelId);
    channelJoin(register3.token, channel1.channelId);
    const details = channelDetails(register1.token, channel1.channelId);
    expect(details).toStrictEqual({
      name: 'person2channel',
      isPublic: false,
      ownerMembers: [
        {
          uId: 1,
          email: 'person2@gmail.com',
          nameFirst: 'person',
          nameLast: 'b',
          handleStr: 'personb'
        }
      ],
      allMembers: [
        {
          uId: 1,
          email: 'person2@gmail.com',
          nameFirst: 'person',
          nameLast: 'b',
          handleStr: 'personb'
        },
        {
          uId: 0,
          email: 'person1@gmail.com',
          nameFirst: 'person',
          nameLast: 'a',
          handleStr: 'persona'
        }
      ]
    });
  });

  test("Testing authUserId which doesn't exist", () => {
    const register1 = authRegister('sewy@gmail.com', '123456', 'cristian', 'ronald');
    const channel1: any = channelsCreate(register1.token, 'sewyschannel', true);
    const joinChannel: any = channelJoin('JSADKJAHDKJAH', channel1.channelId);
    expect(joinChannel).toBe(403);
  });

  test("Testing channelId which doesn't exist", () => {
    const register1 = authRegister('sewy@gmail.com', '123456', 'cristian', 'ronald');
    const channel1: any = channelsCreate(register1.token, 'sewyschannel', true);
    const register2 = authRegister('jaibear123@gmail.com', 'qwerty', 'jai', 'bear');
    const joinChannel: any = channelJoin(register2.token, channel1.channelId + 1);
    expect(joinChannel).toBe(400);
  });

  test('Testing if channel is private', () => {
    const register1 = authRegister('sewy@gmail.com', '123456', 'cristian', 'ronald');
    const channel1: any = channelsCreate(register1.token, 'sewyschannel', false);
    const register2 = authRegister('jaibear123@gmail.com', 'qwerty', 'jai', 'bear');
    const joinChannel: any = channelJoin(register2.token, channel1.channelId);
    expect(joinChannel).toBe(403);
  });

  test('Testing if user is already in channel', () => {
    const register1 = authRegister('sewy@gmail.com', '123456', 'cristian', 'ronald');
    const channel1: any = channelsCreate(register1.token, 'sewyschannel', true);
    const joinChannel: any = channelJoin(register1.token, channel1.channelId);
    expect(joinChannel).toBe(400);
  });

  test('Testing if channel is private and user is not global owner', () => {
    const register1 = authRegister('sewy@gmail.com', '123456', 'cristian', 'ronald');
    const channel1: any = channelsCreate(register1.token, 'sewyschannel', false);
    const register2 = authRegister('simp@gmail.com', 'qwerty', 'simp', 'man');
    const joinChannel: any = channelJoin(register2.token, channel1.channelId);
    expect(joinChannel).toBe(403);
  });

  test('Testing if channel is private and user is global owner', () => {
    const register1 = authRegister('sewy@gmail.com', '123456', 'cristian', 'ronald');
    const register2 = authRegister('simp@gmail.com', 'qwerty', 'simp', 'man');
    const channel1: any = channelsCreate(register2.token, 'simpschannel', false);
    const joinChannel: any = channelJoin(register1.token, channel1.channelId);
    expect(joinChannel).toStrictEqual({});
  });
});
