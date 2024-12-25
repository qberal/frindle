const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_SMTP_HOST,
      port: process.env.MAIL_SMTP_PORT,
      secure: false,
      secureConnection: false,
      auth: {
        user: process.env.MAIL_SMTP_USER,
        pass: process.env.MAIL_SMTP_PASS
      },
      tls: {
        ciphers:'SSLv3'
      }
    });
  }

  async sendToKindle(filePath) {
    const fileName = path.basename(filePath);

    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_SMTP_FROM,
        to: process.env.KINDLE_EMAIL,
        subject: 'Document pour Kindle',
        text: 'Document envoyé via le système de monitoring',
        attachments: [
          {
            filename: fileName,
            path: filePath
          }
        ]
      });

      console.log(`Email envoyé avec succès: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du mail:', error);
      throw error;
    }
  }
}

module.exports = new Mailer();