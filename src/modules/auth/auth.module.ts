import { Module } from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { PasswordRecoveryCommandHandler } from './application/use-cases/command/password-recovery.command-handler';
import { SignupCommandHandler } from './application/use-cases/command/signup.command-handler';
import { UserModule } from '../users/user.module';
import { SendConfirmCodeEventHandler } from './application/use-cases/events/send-confirm-code-event.handler';
import { EmailModule } from '../../core/adapters/mailer/mail.module';
import { LocalStrategy } from './application/strategies/local.strategy';
import { AuthService } from './application/service/auth.service';
import { EmailConfirmCommandHandler } from './application/use-cases/command/email-confirm.command.handler';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthSessionCommandHandler } from './application/use-cases/command/create-auth-session.command.handler';
import { NewPasswordCommandHandler } from './application/use-cases/command/new-password.command-handler';
import { JwtCookieStrategy } from './application/strategies/jwt-cookie.strategy';
import { KillAuthSessionCommandHandler } from './application/use-cases/command/kill-auth-session.command.handler';
import { CacheModule } from '@nestjs/cache-manager';
import { ResendEmailConfirmationCommandHandler } from './application/use-cases/command/resend-email-confirmation.command.handler';
import { AlsModule } from '../../als.module';
import { JwtStrategy } from '../../core/common/guards/jwt.guard';

const commandHandlers = [
  PasswordRecoveryCommandHandler,
  SignupCommandHandler,
  EmailConfirmCommandHandler,
  CreateAuthSessionCommandHandler,
  NewPasswordCommandHandler,
  KillAuthSessionCommandHandler,
  ResendEmailConfirmationCommandHandler,
];
const queryHandlers = [];
const eventHandlers = [SendConfirmCodeEventHandler];
const Strategies = [LocalStrategy, JwtCookieStrategy, JwtStrategy];
@Module({
  imports: [
    CacheModule.register(),
    CqrsModule,
    EmailModule,
    UserModule,
    AlsModule,
  ],
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
