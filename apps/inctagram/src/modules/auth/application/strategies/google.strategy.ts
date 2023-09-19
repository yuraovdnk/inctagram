import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../../../../../libs/common/config/env.config';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import { OauthExternalAccountDto } from '../dto/request/oauth-external-account.dto';

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor() {
    super();
  }
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService<ConfigEnvType, true>,
  ) {
    const settings = configService.get('settings', { infer: true });
    const secrets = configService.get('secrets', { infer: true });
    super({
      clientID: secrets.googleClientId,
      clientSecret: secrets.googleClientSecret,
      callbackURL: `${settings.appDomainName}/back-api/oauth/google/callback`, //TODO to env
      scope: ['email', 'profile'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const externalAccountEntity = new OauthExternalAccountDto(
      profile.provider,
      profile.id,
      profile.displayName,
      profile.emails[0].value,
      profile.username,
    );

    done(null, externalAccountEntity);
  }
}
