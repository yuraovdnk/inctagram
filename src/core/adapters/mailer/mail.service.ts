import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

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
    // const viewsPath = __dirname + '/templates';
    // this.transporter.use(
    //   'compile',
    //   hbs({
    //     viewEngine: {
    //       extname: '.hbs',
    //       layoutsDir: viewsPath,
    //       defaultLayout: false,
    //     },
    //     viewPath: viewsPath,
    //     extName: '.hbs',
    //   }),
    // );
  }

  async sendPasswordRecoveryCodeEmail(email: string, recoveryCode: string) {
    try {
      await this.transporter.sendMail({
        to: email,
        from: this.configService.get('SMTP_USER'),
        subject: 'Password recovery email',
        //template: 'password-recovery',
        //context: { recoveryCode },
        html: `
        <h1>Password recovery</h1>
        <p>password recovery code: ${recoveryCode} <br>
        To finish password recovery please follow the link below:
        <a href="https://somesite.com/password-recovery?recoveryCode=${recoveryCode}">recovery password</a>
        </p>
        `,
      });
    } catch (e) {
      console.log('email sending error: ', e);
    }
  }
  async sendConfirmCode(username: string, email: string, code: string) {
    await this.transporter.sendMail({
      to: email,
      from: this.configService.get('SMTP_USER'),
      subject: 'Confirm Email',
      html: `
        <h1>Confirm Email</h1>
        <p>email confirmation code: ${code} <br>
        To confirm your email please follow the link below:
        <a href="https://somesite.com/password-recovery?code=${code}">recovery password</a>
        </p>
        `,
      //template: 'confirm-email-code',
      //context: { confirmationCode: code, username },
    });
  }
}
