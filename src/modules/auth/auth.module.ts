import { Module } from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { PasswordRecoveryCommandHandler } from './application/use-cases/command/password-recovery.command-handler';
import { SignupCommandHandler } from './application/use-cases/command/signup.command-handler';
import { UserModule } from '../users/user.module';
import { CreatedUserEventHandler } from './application/use-cases/events/created-user.event.handler';
import { EmailModule } from '../../core/adapters/mailer/mail.module';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthService } from './application/service/auth.service';
import { EmailConfirmCommandHandler } from './application/use-cases/command/email-confirm.command.handler';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthSessionCommandHandler } from './application/use-cases/command/create-auth-session.command.handler';
import { NewPasswordCommandHandler } from './application/use-cases/command/new-password.command-handler';
import { JwtCookieStrategy } from './application/strategies/jwt-cookie.strategy';
import { KillAuthSessionCommandHandler } from './application/use-cases/command/kill-auth-session.command.handler';

const commandHandlers = [
  PasswordRecoveryCommandHandler,
  SignupCommandHandler,
  EmailConfirmCommandHandler,
  CreateAuthSessionCommandHandler,
  NewPasswordCommandHandler,
  KillAuthSessionCommandHandler,
];
const queryHandlers = [];
const eventHandlers = [CreatedUserEventHandler];
const Strategies = [LocalStrategy, JwtCookieStrategy];
@Module({
  imports: [CqrsModule, EmailModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    AuthRepository,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
    ...Strategies,
  ],
})
export class AuthModule {}
