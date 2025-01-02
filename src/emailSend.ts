const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  maxConnections: 5,
  pool: true,
  host: 'smtp-mail.outlook.com', // hostname
  secure: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
    ciphers: 'SSLv3'
  },
  auth: {
    user: 't11bboost@outlook.com',
    pass: 'helloboost@1'
  }
});

/**
 * Sends Email
 * @param email - email of the user
 * @param resetCode - reset code sent to email
 * @returns {}
 */

export function emailSendCode(email: string, code: string) {
  const message = {
    from: 't11bboost@outlook.com',
    to: email,
    subject: 'Password Reset Code',
    text: code
  };
  transporter.sendMail(message, function(error: any, info: any) {
    if (error) console.log(error);
    transporter.close();
  });
}
