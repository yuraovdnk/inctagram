import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import { AuthRepository } from '../../infrastructure/repository/auth.repository';
import { ConfigEnvType } from '../../../../../../../libs/common/config/env.config';

@Injectable()
export class JwtCookieGuard extends AuthGuard('jwt-cookie') {
  constructor() {
    super();
  }
}

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(
    private usersRepository: UsersRepository,
    private authRepository: AuthRepository,
    private configService: ConfigService<ConfigEnvType, boolean>,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req.cookies?.refreshToken) {
          return null;
        }
        return req.cookies.refreshToken;
      },

      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secrets.secretRefreshToken', {
        infer: true,
      }),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.usersRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const session = await this.authRepository.findAuthSessionByDeviceId(
      payload.deviceId,
    );

    if (!session) {
      throw new UnauthorizedException();
    }

    //if jwt passport to pass expired token, then throw error

    if (session.compare(payload.exp, payload.iat)) {
      throw new UnauthorizedException();
    }
    return { id: user.id, deviceId: payload.deviceId };
  }
}
