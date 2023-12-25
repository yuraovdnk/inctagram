import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConfigEnvType } from '../../../../../../../libs/common/config/env.config';
import * as bcrypt from 'bcrypt';
export type JwtTokens = { accessToken: string; refreshToken: string };

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<ConfigEnvType, true>,
    private jwtService: JwtService,
  ) {}

  generateTokens(userId: string, deviceId: string): JwtTokens {
    const accessToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets', {
          infer: true,
        }).secretAccessToken,
        expiresIn: this.configService.get('secrets', {
          infer: true,
        }).timeExpireAccessToken,
      },
    );

    const refreshToken = this.jwtService.sign(
      { userId, deviceId },
      {
        secret: this.configService.get('secrets', {
          infer: true,
        }).secretRefreshToken,
        expiresIn: this.configService.get('secrets', {
          infer: true,
        }).timeExpireRefreshToken,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  getPasswordHash(password: string): string {
    const salt = this.configService.get('secrets', {
      infer: true,
    }).passwordSaltHash;

    return bcrypt.hashSync(password, 10);
  }
  async getUsersPrimaryEmail(accessToken: string): Promise<string> {
    const apiUrl = 'https://api.github.com/user/emails';
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const emailData = await res.json();

    const { email } = emailData.find((email) => email.primary);
    return email;
  }
}
