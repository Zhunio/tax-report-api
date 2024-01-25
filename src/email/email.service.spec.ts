import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { SendMailOptions } from 'nodemailer';
import { AppModule } from '../app/app.module';
import { EmailService } from './email.service';

const { spyOn } = jest;

describe('EmailService', () => {
  let app: INestApplication;
  let emailService: EmailService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    emailService = module.get(EmailService);
    configService = module.get(ConfigService);

    await app.init();
  });

  it('should sent email', async () => {
    // @ts-ignore
    spyOn(emailService.transporter, 'sendMail').mockResolvedValueOnce({} as SendMailOptions);
    // @ts-ignore
    spyOn(emailService, 'appendEmailToSentFolder').mockResolvedValueOnce();

    const mailOptions: SendMailOptions = {
      to: 'john@live.com',
      subject: 'Email Service Test',
      html: '<p>Hello World</p>',
    };

    await emailService.sendEmail(mailOptions);
  });
});
