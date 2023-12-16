import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class EmailService {
  private readonly transporter;
  constructor(
    private readonly configService: ConfigService,
    private als: AsyncLocalStorage<any>,
  ) {
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
    const referer = this.als.getStore().host;
    try {
      await this.transporter.sendMail({
        to: email,
        from: this.configService.get('SMTP_USER'),
        subject: 'Password recovery email',
        html: `
          <div class="subject mb-20">Finish password recovery</div>
          <div class="overflow-auto mb-20" style="overflow-y: hidden !important">
              <div style="width: 600px; text-align: center; font-family: Figtree,sans-serif">
              <br>
              <br>
              <h2 style="color: #161616">Verify your email address</h2>
              <br>
              <div>
                  <p style="font-size: 16px; color: #161616">
                  Thanks for joining. Please click the button below and set up your account. It takes less than a minute.
                  </p>
                  <br>
                  <br>
                  <div>
                      <a href="https://${referer}}/auth/create-new-password?code=${recoveryCode}" style="background-color: #397DF6; color: #ffffff; border: 0;
                                 padding: 10px 20px; border-radius: 8px; font-size: 24px; margin: 15px;
                                 text-decoration: none;
                                 " target="_blank">Set up your account</a>
                   </div>
              </div>
              <br>
              <br>
              <div>
                  <img style="width: 600px" src="https://nest-public-avatar.s3.eu-central-1.amazonaws.com/audit-g2e5a4a6f9_1280.jpg" alt="inctagram">
              </div>
              </div>
           </div>
        `,
      });
    } catch (e) {
      console.log('email sending error: ', e);
    }
  }
  async sendConfirmCode(username: string, email: string, code: string) {
    const referer = this.als.getStore().host;
    await this.transporter.sendMail({
      to: email,
      from: this.configService.get('SMTP_USER'),
      subject: 'Confirm Email',
      html: `
       <div class="subject mb-20">Finish registration</div>
        <div class="overflow-auto mb-20" style="overflow-y: hidden !important">
            <div style="width: 600px; text-align: center; font-family: Figtree,sans-serif">
            <br>
            <br>
            <h2 style="color: #161616">Verify your email address</h2>
            <br>
            <div>
                <p style="font-size: 16px; color: #161616">
                Thanks for joining. Please click the button below and set up your account. It takes less than a minute.
                </p>
                <br>
                <br>
                <div>
                    <a href="https://${referer}/auth/email-confirmed?code=${code}" style="background-color: #397DF6; color: #ffffff; border: 0;
                               padding: 10px 20px; border-radius: 8px; font-size: 24px; margin: 15px;
                               text-decoration: none;
                               " target="_blank">Set up your account</a>
                 </div>
            </div>
            <br>
            <br>
            <div>
                <img style="width: 600px" src="https://nest-public-avatar.s3.eu-central-1.amazonaws.com/audit-g2e5a4a6f9_1280.jpg" alt="inctagram">
            </div>
            </div>
         </div>
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
