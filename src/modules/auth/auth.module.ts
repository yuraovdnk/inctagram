import { Module } from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { PasswordRecoveryCommandHandler } from './application/use-cases/command/password-recovery.command-handler';
import { SignupCommandHandler } from './application/use-cases/command/signup.command-handler';
import { UserModule } from '../users/user.module';
import { CreatedUserEventHandler } from './application/use-cases/events/created-user.event.handler';
import { EmailModule } from '../../core/adapters/mailer/mail.module';


const commandHandlers = [PasswordRecoveryCommandHandler, SignupCommandHandler];
const queryHandlers = [];
const eventsHandler = [CreatedUserEventHandler];
@Module({
  imports: [CqrsModule, EmailModule,UserModule],
  controllers: [AuthController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...eventsHandler,
    AuthRepository,
  ],
})
export class AuthModule {}
