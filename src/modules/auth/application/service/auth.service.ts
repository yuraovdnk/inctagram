import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../../core/common/config/env.config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<ConfigEnvType, true>,
    private jwtService: JwtService,
  ) {}

  generateTokens(
    userId: string,
    deviceId: string,
  ): { accessToken: string; refreshToken: string } {
    const accessToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets.secretAccessToken', {
          infer: true,
        }),
        expiresIn: this.configService.get('secrets.timeExpireAccessToken', {
          infer: true,
        }),
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets.secretRefreshToken', {
          infer: true,
        }),
        expiresIn: this.configService.get('secrets.timeExpireRefreshToken', {
          infer: true,
        }),
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
