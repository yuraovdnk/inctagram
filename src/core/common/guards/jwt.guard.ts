import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../config/env.config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '../../../modules/auth/infrastructure/repository/auth.repository';
import { UsersRepository } from '../../../modules/users/instrastructure/repository/users.repository';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authRepo: AuthRepository,
    private userRepo: UsersRepository,
    private configService: ConfigService<ConfigEnvType, boolean>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('secrets', { infer: true })
        .secretAccessToken,
    });
  }
  async validate(payload: any) {
    const [authSession, user] = await Promise.all([
      this.authRepo.findAuthSessionByDeviceId(payload.deviceId),
      this.userRepo.findById(payload.userId),
    ]);

    if (!authSession || !user) throw new UnauthorizedException();

    return user;
  }
}
