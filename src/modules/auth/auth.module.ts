import { Module } from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { PasswordRecoveryCommandHandler } from './application/use-cases/command/password-recovery.command-handler';
import { MailModule } from '../mailer/mail.module';
import { EmailModule } from '../../core/adapters/mailer/mail.module';

const commandHandlers = [PasswordRecoveryCommandHandler];
const queryHandlers = [];
@Module({
  imports: [CqrsModule, MailModule, EmailModule],
  controllers: [AuthController],
  providers: [...commandHandlers, ...queryHandlers, AuthRepository],
})
export class AuthModule {}
