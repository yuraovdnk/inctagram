import { AuthGuard, PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../../../../../libs/common/config/env.config';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import { Profile, Strategy } from 'passport-github';
import { OauthExternalAccountDto } from '../dto/request/oauth-external-account.dto';

@Injectable()
export class GithubGuard extends AuthGuard('github') {
  constructor() {
    super();
  }
}

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private usersRepository: UsersRepository,
    private configService: ConfigService<ConfigEnvType, true>,
  ) {
    const settings = configService.get('settings', { infer: true });
    const secrets = configService.get('secrets', { infer: true });
    super({
      clientID: secrets.githubClientId,
      clientSecret: secrets.githubClientSecret,
      callbackURL: `${settings.apiHomeUrl}/oauth/github/callback`,
      scope: ['public_profile', 'user:email'],
    });
  }
  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    const externalAccountEntity = new OauthExternalAccountDto(
      profile.provider,
      profile.id,
      profile.displayName,
      profile.emails[0].value,
      profile.username,
    );

    return externalAccountEntity;
  }
}
