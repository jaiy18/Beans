export interface Error {
    error: string
}

export interface Auth {
  token: string,
  authUserId: number
}

export interface ChannelId {
  channelId: number
}

export interface User {
  uId: number,
  email: string,
  nameFirst: string,
  nameLast: string,
  handleStr: string
}

export interface React {
  reactId: number,
  uIds: Array<number>,
  isThisUserReacted: boolean
}

export interface MessageCreate {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number,
  reacts: React[],
  isPinned: boolean
}

export interface Message {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number
  reacts: React[],
  isPinned: boolean
}

export interface MessageWithoutReact {
  messageId: number,
  uId: number,
  message: string,
  timeSent: number
}

export interface ChannelDetails {
    name: string,
    isPublic: boolean,
    ownerMembers: User[],
    allMembers: User[]
}

export interface Channel {
  channelId: number,
  name: string,
  isPublic: boolean,
  allMembers: User[],
  ownerMembers: User[],
  messages: Message[],
  standupMessage: string,
  standupActive: boolean,
  standupTimeFinish: number,
  standupStarterId: number
}

export interface channelList {
  channelId: number,
  name: string,
}

export interface Messages {
  messages: MessageWithoutReact[],
  start: number,
  end: number
}

export interface Notification {
  channelId: number,
  dmId: number,
  notificationMessage: string
}

export interface Registration {
    authUserId: number,
    token: string,
    email: string,
    password: string,
    nameFirst: string,
    nameLast: string,
    handleStr: string,
    permission: number,
    notifications: Notification[],
    profileImgUrl: string

}

export interface UserObj {
  user: {
    uId: number,
    email: string,
    nameFirst: string,
    nameLast: string,
    handleStr: string
  }
}

export interface MessageId {
  messageId: number
}

export interface Dm {
  dmId: number,
  name: string,
  allMembers: Array<number>,
  ownerMembers: Array<number>,
  messages: Message[]
}

export interface DmDetails {
  name: string,
  members: Array<object>
}

export interface UsersAll {
  users: User[]
}

export interface Reset {
  resetCode: string,
  email: string,
  // waitTime: number,
  // timeStamp: number
}

export interface channelsJoined {
  numChannelsJoined: number;
  timeStamp: number;
}

export interface dmsJoined {
  numDmsJoined: number;
  timeStamp: number;
}

export interface messagesSent {
  numMessagesSent: number;
  timeStamp: number;
}

export interface userStat {
  uId: number,
  channelsJoined: channelsJoined[],
  dmsJoined: dmsJoined[],
  messagesSent: messagesSent[],
  involvementRate: number
}

export interface channelsExist {
  numChannelsExist: number;
  timeStamp: number;
}

export interface dmsExist {
  numDmsExist: number;
  timeStamp: number;
}

export interface messagesExist {
  numMessagesExist: number;
  timeStamp: number;
}

export interface workSpaceStats {
  workspaceStats: {
    channelsExist: channelsExist[],
    dmsExist: dmsExist[],
    messagesExist: messagesExist[],
    utilizationRate: number
  }
}

export interface DataBase {
  resetCodes: Reset[],
  users: Registration[],
  channels: Channel[],
  dms: Dm[],
  userStats: userStat[],
  workspaceStats: {
    channelsExist: channelsExist[];
    dmsExist: dmsExist[];
    messagesExist: messagesExist[];
    utilizationRate: number;
  }
}

export interface Stats {
  userStats: {
    channelsJoined: channelsJoined[],
    dmsJoined: dmsJoined[],
    messagesSent: messagesSent[],
    involvementRate: number
  }
}
