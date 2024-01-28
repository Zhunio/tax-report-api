import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImapFlow } from 'imapflow';
import nodemailer, { SendMailOptions } from 'nodemailer';
import MailComposer from 'nodemailer/lib/mail-composer';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  private readonly transporter = nodemailer.createTransport({
    host: 'smtp.titan.email',
    port: 465,
    secure: true,
    auth: {
      user: this.configService.get('EMAIL_USERNAME'),
      pass: this.configService.get('EMAIL_PASSWORD'),
    },
  });

  async sendEmail(mailOptions: SendMailOptions) {
    mailOptions = {
      ...mailOptions,
      from: {
        name: 'Tax Report',
        address: this.configService.get('EMAIL_USERNAME'),
      },
    };

    const sentEmailInfo = await this.transporter.sendMail(mailOptions);
    await this.appendEmailToSentFolder({ ...mailOptions });

    return sentEmailInfo;
  }

  private async appendEmailToSentFolder(mailOptions: SendMailOptions) {
    const client = new ImapFlow({
      host: 'imap.titan.email',
      port: 993,
      secure: true,
      logger: false,
      auth: {
        user: this.configService.get('EMAIL_USERNAME'),
        pass: this.configService.get('EMAIL_PASSWORD'),
      },
    });

    const mailComposer = new MailComposer({ ...mailOptions });

    const sentFolder = 'Sent';
    await client.connect();
    const lock = await client.getMailboxLock(sentFolder);

    try {
      const messageBuffer = await mailComposer.compile().build();
      await client.append(sentFolder, messageBuffer);
    } catch (error) {
      lock.release();
    }

    await client.logout();
  }
}
