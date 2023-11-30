import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthController } from './api/controllers/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthRepository } from './infrastructure/repository/auth.repository';
import { PasswordRecoveryCommandHandler } from './application/use-cases/command/password-recovery.command-handler';
import { SignupCommandHandler } from './application/use-cases/command/signup.command-handler';
import { UserModule } from '../users/user.module';
import { SendConfirmCodeEventHandler } from './application/use-cases/events/send-confirm-code-event.handler';
import { EmailModule } from '../../../../../libs/adapters/mailer/mail.module';
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
import { JwtStrategy } from '../../../../../libs/common/guards/jwt.guard';
import { GoogleStrategy } from './application/strategies/google.strategy';
import { AuthenticationByExternalAccountCommandHandler } from './application/use-cases/command/authentication-by-external-account-command.handler';
import { GithubStrategy } from './application/strategies/github.strategy';
import { UserCreatedByExternalAccountEventHandler } from './application/use-cases/events/user-created-by-external-account-event.handler';
import { OauthController } from './api/controllers/oauth.controller';
import { PasswordRecoveryEventHandler } from './application/use-cases/events/password-recovery-event.handler';
import { AsyncLocalStorage } from 'node:async_hooks';

const commandHandlers = [
  PasswordRecoveryCommandHandler,
  SignupCommandHandler,
  EmailConfirmCommandHandler,
  CreateAuthSessionCommandHandler,
  NewPasswordCommandHandler,
  KillAuthSessionCommandHandler,
  ResendEmailConfirmationCommandHandler,
  AuthenticationByExternalAccountCommandHandler,
];
const queryHandlers = [];
const eventHandlers = [
  SendConfirmCodeEventHandler,
  UserCreatedByExternalAccountEventHandler,
  PasswordRecoveryEventHandler,
];
const Strategies = [
  LocalStrategy,
  JwtCookieStrategy,
  JwtStrategy,
  GoogleStrategy,
  GithubStrategy,
];
@Module({
  imports: [CacheModule.register(), CqrsModule, EmailModule, UserModule],
  controllers: [AuthController, OauthController],
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
export class AuthModule implements NestModule {
  constructor(private readonly als: AsyncLocalStorage<any>) {}
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply((req, res, next) => {
        const store = {
          host: req.headers.host,
        };
        this.als.run(store, () => next());
      })
      .exclude(
        { path: 'auth', method: RequestMethod.PUT },
        { path: 'auth', method: RequestMethod.GET },
      )
      .forRoutes('auth');
  }
}
