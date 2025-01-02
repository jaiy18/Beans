import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';
import { authRegisterV1, authLoginV1, authLogoutV1, authPasswordResetRequestV1, authPasswordResetResetV1 } from './auth';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import {
  channelDetailsV1, channelInviteV1, channelMessagesV1, channelJoinV1, channelLeaveV1,
  channelAddOwnerV1, channelRemoveOwnerV1
} from './channel';
import {
  userProfileV1, usersAllV1, userProfileSetnameV1, userProfileSetemailV1, userProfileSethandleV1,
  userStatsV1, usersStatsV1, userProfileUploadPhotoV1
} from './users';
import { clearV1, notificationsGetV1 } from './other';
import {
  messageSendV1, messageSendDmV1, messageRemoveV1, messagePinV1, messageUnpinV1,
  messageEditV1, messageShareV1, messageSendLaterV1, messageSendLaterDmV1, messageReactV1, messageUnreactV1
} from './message';
import { dmCreateV1, dmListV1, dmLeaveV1, dmMessagesV1, dmDetailsV1, dmRemoveV1 } from './dm';
import { searchV1 } from './search';
import { adminUserRemoveV1, adminUserPermissionChangeV1 } from './admin';
import { standupStartV1, standupActiveV1, standupSendV1 } from './standup';

const fs = require('fs');
if (fs.existsSync('./database.json')) {
  clearV1();
}

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());

app.use('/ProfilePictures', express.static('ProfilePictures'));
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

// for logging errors (print to terminal)
app.use(morgan('dev'));

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

app.post('/auth/register/v3', (req: Request, res: Response) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(
    authRegisterV1(email, password, nameFirst, nameLast)
  );
});

app.post('/auth/login/v3', (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.json(
    authLoginV1(email, password)
  );
});

app.post('/auth/logout/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(authLogoutV1(token));
});

app.post('/auth/passwordreset/request/v1', (req: Request, res: Response) => {
  const { email } = req.body;
  res.json(
    authPasswordResetRequestV1(email));
});

app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response) => {
  const { resetCode, newPassword } = req.body;
  res.json(
    authPasswordResetResetV1(resetCode, newPassword));
});

app.get('/channel/messages/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(channelMessagesV1((token),
    parseInt(req.query.channelId as string),
    parseInt(req.query.start as string)));
});

app.post('/channel/join/v3', (req: Request, res: Response) => {
  const { channelId } = req.body;
  const token = req.header('token');
  res.json(
    channelJoinV1(token, channelId)
  );
});

app.post('/channels/create/v3', (req: Request, res: Response) => {
  const { name, isPublic } = req.body;
  const token = req.header('token');
  res.json(
    channelsCreateV1(token, name, isPublic)
  );
});

app.get('/channels/list/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(channelsListV1((token)));
});

app.get('/channels/listAll/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(channelsListAllV1((token)));
});

app.get('/channel/details/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(channelDetailsV1((token),
    parseInt(req.query.channelId as string)));
});

app.post('/channel/invite/v3', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  res.json(
    channelInviteV1(token, channelId, uId)
  );
});

app.post('/channel/leave/v2', (req: Request, res: Response) => {
  const { channelId } = req.body;
  const token = req.header('token');
  res.json(channelLeaveV1(token, channelId));
});

app.get('/user/profile/v3', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(userProfileV1((token),
    parseInt(req.query.uId as string)));
});

app.get('/users/all/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(usersAllV1((token)));
});

app.put('/user/profile/setname/v2', (req: Request, res: Response) => {
  const { nameFirst, nameLast } = req.body;
  const token = req.header('token');
  res.json(userProfileSetnameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response) => {
  const { email } = req.body;
  const token = req.header('token');
  res.json(userProfileSetemailV1(token, email));
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response) => {
  const { handle } = req.body;
  const token = req.header('token');
  res.json(userProfileSethandleV1(token, handle));
});

app.get('/user/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(userStatsV1((token)));
});

app.get('/users/stats/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(usersStatsV1((token)));
});

app.post('/message/send/v2', (req: Request, res: Response) => {
  const { channelId, message } = req.body;
  const token = req.header('token');
  res.json(messageSendV1(token, channelId, message));
});

app.post('/channel/addowner/v2', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  res.json(channelAddOwnerV1(token, channelId, uId));
});

app.post('/channel/removeowner/v2', (req: Request, res: Response) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});
app.post('/dm/create/v2', (req: Request, res: Response) => {
  const { uIds } = req.body;
  const token = req.header('token');
  res.json(dmCreateV1(token, uIds));
});

app.get('/dm/list/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(dmListV1((token)));
});

app.post('/dm/leave/v2', (req: Request, res: Response) => {
  const { dmId } = req.body;
  const token = req.header('token');
  res.json(dmLeaveV1(token, dmId));
});

app.get('/dm/messages/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(dmMessagesV1((token),
    parseInt(req.query.dmId as string),
    parseInt(req.query.start as string)));
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(dmDetailsV1((token),
    parseInt(req.query.dmId as string)));
});

app.delete('/dm/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(dmRemoveV1((token),
    parseInt(req.query.dmId as string)));
});

app.post('/message/senddm/v2', (req: Request, res: Response) => {
  const { dmId, message } = req.body;
  const token = req.header('token');
  res.json(messageSendDmV1(token, dmId, message));
});

app.delete('/message/remove/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(messageRemoveV1((token),
    parseInt(req.query.messageId as string)));
});

app.put('/message/edit/v2', (req: Request, res: Response) => {
  const { messageId, message } = req.body;
  const token = req.header('token');
  res.json(messageEditV1(token, messageId, message));
});

app.get('/search/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(searchV1((token), req.query.queryStr as string));
});

app.delete('/admin/user/remove/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(adminUserRemoveV1((token),
    parseInt(req.query.uId as string)));
});

app.post('/message/share/v1', (req: Request, res: Response) => {
  const { ogMessageId, message, channelId, dmId } = req.body;
  const token = req.header('token');
  res.json(messageShareV1(token, ogMessageId, message, channelId, dmId));
});

app.post('/admin/userpermission/change/v1', (req: Request, res: Response) => {
  const { uId, permissionId } = req.body;
  const token = req.header('token');
  res.json(adminUserPermissionChangeV1(token, uId, permissionId));
});

app.post('/message/sendlater/v1', (req: Request, res: Response) => {
  const { channelId, message, timeSent } = req.body;
  const token = req.header('token');
  res.json(messageSendLaterV1(token, channelId, message, timeSent));
});

app.post('/message/sendlaterdm/v1', (req: Request, res: Response) => {
  const { dmId, message, timeSent } = req.body;
  const token = req.header('token');
  res.json(messageSendLaterDmV1(token, dmId, message, timeSent));
});
app.post('/message/react/v1', (req: Request, res: Response) => {
  const { messageId, reactId } = req.body;
  const token = req.header('token');
  res.json(messageReactV1(token, messageId, reactId));
});

app.post('/message/unreact/v1', (req: Request, res: Response) => {
  const { messageId, reactId } = req.body;
  const token = req.header('token');
  res.json(messageUnreactV1(token, messageId, reactId));
});
app.post('/standup/start/v1', (req: Request, res: Response) => {
  const { channelId, length } = req.body;
  const token = req.header('token');
  res.json(standupStartV1(token, channelId, length));
});

app.get('/standup/active/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(standupActiveV1((token),
    parseInt(req.query.channelId as string)));
});

app.post('/standup/send/v1', (req: Request, res: Response) => {
  const { channelId, message } = req.body;
  const token = req.header('token');
  res.json(standupSendV1(token, channelId, message));
});

app.post('/message/Pin/v1', (req: Request, res: Response) => {
  const { messageId } = req.body;
  const token = req.header('token');
  res.json(messagePinV1(token, messageId));
});

app.post('/message/Unpin/v1', (req: Request, res: Response) => {
  const { messageId } = req.body;
  const token = req.header('token');
  res.json(messageUnpinV1(token, messageId));
});

app.post('/user/profile/uploadphoto/v1', (req: Request, res: Response) => {
  const { imgUrl, xStart, yStart, xEnd, yEnd } = req.body;
  const token = req.header('token');
  res.json(userProfileUploadPhotoV1(token, imgUrl, xStart, yStart, xEnd, yEnd));
});

// clear data
app.delete('/clear/v1', (req: Request, res: Response) => {
  res.json(clearV1());
});

app.get('/notifications/get/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  res.json(notificationsGetV1((token)));
});

// handles errors nicely
app.use(errorHandler());

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
