import {
  channelsCreate, authRegister, channelDetails,
  channelInvite, clear
} from './serverHelperFunctions';
import { User } from './interfaces';

beforeEach(clear);
afterAll(clear);

describe('Testing channelInvite for it-2', () => {
  test('Inviting to a Public channel', () => {
    authRegister('ethan@ad.unsw.edu.au', 'eth123', 'ethan', 'phan');
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const user3 = authRegister('isaacchange@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(user2.token, 'hayhaychannel', true);
    channelInvite(user2.token, channel.channelId, user3.authUserId);
    const details = channelDetails(user2.token, channel.channelId);
    const allmems = details.allMembers.map((mem: User) => mem.uId);
    expect(allmems).toContain(2);
  });
  test('Inviting a global owner', () => {
    const user1 = authRegister('ethan@ad.unsw.edu.au', 'eth123', 'ethan', 'phan');
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const channel = channelsCreate(user2.token, 'hayhaychannel', true);
    channelInvite(user2.token, channel.channelId, user1.authUserId);
    const details = channelDetails(user2.token, channel.channelId);
    const owners = details.ownerMembers.map((mem: User) => mem.uId);
    const allmems = details.allMembers.map((mem: User) => mem.uId);
    expect(owners).toEqual(expect.not.arrayContaining([0]));
    expect(allmems).toContain(0);
  });
  test('Invalid Token', () => {
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const user3 = authRegister('isaacchange@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(user2.token, 'hayhaychannel', false);
    const invite = channelInvite('DHAJSHDKHAKD', channel.channelId, user3.authUserId);
    expect(invite).toBe(403);
  });
  test('Inviting to an Invalid Channel', () => {
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const user3 = authRegister('isaacchange@gmail.com', 'isaac123', 'isaac', 'chang');
    const invite = channelInvite(user2.token, -1, user3.authUserId);
    expect(invite).toBe(400);
  });
  test('authUserId is not in the channel', () => {
    const user1 = authRegister('ethan@ad.unsw.edu.au', 'eth123', 'ethan', 'phan');
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const user3 = authRegister('isaacchange@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(user2.token, 'hayhaychannel', false);
    channelsCreate(user3.token, 'channel3', true);
    const invite = channelInvite(user3.token, channel.channelId, user1.authUserId);
    expect(invite).toBe(403);
  });
  test('user is already in channel', () => {
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const user3 = authRegister('isaacchange@gmail.com', 'isaac123', 'isaac', 'chang');
    const channel = channelsCreate(user2.token, 'hayhaychannel', false);
    channelInvite(user2.token, channel.channelId, user3.authUserId);
    const invite1 = channelInvite(user2.token, channel.channelId, user3.authUserId);
    expect(invite1).toBe(400);
  });
  test('user is already in channel', () => {
    const user2 = authRegister('hay@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const user3 = authRegister('haasdady@ad.unsw.edu.au', 'hayhay123', 'hay', 'hay');
    const channel = channelsCreate(user2.token, 'hayhaychannel', false);
    const invite1 = channelInvite(user2.token, channel.channelId, user3.authUserId + 1);
    expect(invite1).toBe(400);
  });
});
