import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthRepository } from '../../infrastructure/repository/auth.repository';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../../core/common/config/env.config';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authRepository: AuthRepository,
    private usersRepo: UsersRepository,
    private configService: ConfigService<ConfigEnvType, true>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('secrets', { infer: true })
        .secretAccessToken,
    });
  }

  async validate(payload: any) {
    const session = await this.authRepository.findAuthSessionByDeviceId(
      payload.deviceId,
    );
    if (!session) throw NotFoundException;
    const user = await this.usersRepo.findById(payload.userId);
    if (!user) throw new NotFoundException();
    return user;
  }
}
