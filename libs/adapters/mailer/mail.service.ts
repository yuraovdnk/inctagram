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
  }

  async sendPasswordRecoveryCodeEmail(email: string, recoveryCode: string) {
    try {
      await this.transporter.sendMail({
        to: email,
        from: this.configService.get('SMTP_USER'),
        subject: 'Password recovery email',
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
    const homeUrl = this.configService.get('API_HOME_URL');
    await this.transporter.sendMail({
      to: email,
      from: this.configService.get('SMTP_USER'),
      subject: 'Confirm Email',
      html: `
        <h1>Confirm Email</h1>
        <p>email confirmation code: ${code} <br>
        To confirm your email please follow the link below:
        <a href="${homeUrl}/auth/email-confirm?code=${code}">recovery password</a>
        </p>
        `,
      text: `confirm code - ${code}`,
    });
  }

  async sendMailWithSuccessRegistration(email: string) {
    await this.transporter.sendMail({
      to: email,
      from: this.configService.get('SMTP_USER'),
      subject: 'Success authentication',
      html: `
        <p>Congratulations,<br>
        your account has been successfully created
      `,
    });
  }
}
