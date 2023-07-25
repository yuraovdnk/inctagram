import { Injectable } from '@nestjs/common';
//import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    //private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // async sendEmail(to: string, subject: string, template: string, context: any) {
  //   try {
  //     await this.mailerService.sendMail({
  //       to,
  //       from: this.configService.get('SMTP_USER'),
  //       subject,
  //       template,
  //       context,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  //}
}
