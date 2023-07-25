import { Module } from '@nestjs/common';
//import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
//import { ConfigModule, ConfigService } from '@nestjs/config';
//import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     transport: {
    //       host: 'smtp.gmail.com',
    //       port: 465,
    //       ignoreTLS: true,
    //       secure: true,
    //       auth: {
    //         user: configService.get('SMTP_USER'),
    //         pass: configService.get('SMTP_PASS'),
    //       },
    //       tls: { rejectUnauthorized: false },
    //     },
    //     defaults: {
    //       from: '"nest-modules" <modules@nestjs.com>',
    //     },
    //     template: {
    //       dir: __dirname + '/templates',
    //       adapter: new HandlebarsAdapter(),
    //       options: {
    //         strict: true,
    //       },
    //     },
    //   }),
    // }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
