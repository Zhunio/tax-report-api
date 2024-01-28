import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SendMailOptions, SentMessageInfo } from 'nodemailer';
import { EmailModule } from './email.module';
import { EmailService } from './email.service';

const { spyOn } = jest;

describe('EmailService', () => {
  let app: INestApplication;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmailModule],
    }).compile();

    app = module.createNestApplication();
    emailService = module.get(EmailService);

    await app.init();
  });

  it('should sent email', async () => {
    spyOn((emailService as any).transporter, 'sendMail').mockResolvedValueOnce(
      {} as SentMessageInfo,
    );
    spyOn(emailService as any, 'appendEmailToSentFolder').mockImplementationOnce(() =>
      Promise.resolve(),
    );

    const mailOptions: SendMailOptions = {
      to: 'john@live.com',
      subject: 'Email Service Test',
      html: '<p>Hello World</p>',
    };

    const sentMailInfo = await emailService.sendEmail(mailOptions);

    expect(sentMailInfo).toEqual({} as SentMessageInfo);
  });
});
