import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

@Injectable()
export class EmailService {
  private readonly transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      ignoreTLS: true,
      tls: { rejectUnauthorized: false },
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
    const viewsPath = __dirname + '/templates';
    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: viewsPath,
          defaultLayout: false,
        },
        viewPath: viewsPath,
        extName: '.hbs',
      }),
    );
  }

  async sendPasswordRecoveryCodeEmail(email: string, recoveryCode: string) {
    try {
      await this.transporter.sendMail({
        to: email,
        from: this.configService.get('SMTP_USER'),
        subject: 'Password recovery email',
        template: 'password-recovery',
        context: { recoveryCode },
      });
    } catch (e) {
      console.error('email sending error: ', e);
    }
  }
  async sendConfirmCode(username: string, email: string, code: string) {
    await this.transporter.sendMail({
      to: email,
      from: this.configService.get('SMTP_USER'),
      subject: 'Confirm Email',
      template: 'confirm-email-code',
      context: { confirmationCode: code, username },
    });
  }
}
