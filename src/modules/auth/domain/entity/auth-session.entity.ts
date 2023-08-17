import { UserEntity } from '../../../users/domain/entity/user.entity';
import { DeviceInfoType } from '../../../../core/common/decorators/device-info.decorator';
import { getLogger } from 'nodemailer/lib/shared';
import { is, tr } from 'date-fns/locale';
import { UnauthorizedException } from '@nestjs/common';

export class AuthSessionEntity {
  id: string;
  userId: string;
  deviceName: string;
  issuedAt: Date;
  expireAt: Date;
  deviceId: string;
  ip: string;
  user?: UserEntity;
  constructor() {}

  static create(
    deviceInfo: DeviceInfoType,
    userId: string,
    timeToken: { exp: Date; iat: Date },
  ) {
    const authSession = new AuthSessionEntity();
    authSession.userId = userId;
    authSession.deviceId = deviceInfo.deviceId;
    authSession.deviceName = deviceInfo.deviceName;
    authSession.ip = deviceInfo.ip;
    authSession.issuedAt = timeToken.iat;
    authSession.expireAt = timeToken.exp;
    return authSession;
  }

  refreshSession(deviceId: string, timeToken: { exp: Date; iat: Date }) {
    this.deviceId = deviceId;
    this.expireAt = timeToken.exp;
    this.issuedAt = timeToken.iat;
  }
  compare(expireAt: number, issuedAt: number): boolean {
    return (
      this.issuedAt.getTime() !== new Date(issuedAt * 1000).getTime() ||
      this.expireAt.getTime() !== new Date(expireAt * 1000).getTime()
    );
  }
}
