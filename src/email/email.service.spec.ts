import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SendMailOptions } from 'nodemailer';
import { AppModule } from '../app/app.module';
import { EmailService } from './email.service';

const { spyOn } = jest;

describe('EmailService', () => {
  let app: INestApplication;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    emailService = module.get(EmailService);

    await app.init();
  });

  it('should sent email', async () => {
    spyOn((emailService as any).transporter, 'sendMail').mockResolvedValueOnce(
      {} as SendMailOptions,
    );
    spyOn(emailService as any, 'appendEmailToSentFolder').mockRejectedValueOnce({});

    const mailOptions: SendMailOptions = {
      to: 'john@live.com',
      subject: 'Email Service Test',
      html: '<p>Hello World</p>',
    };

    await emailService.sendEmail(mailOptions);
  });
});
