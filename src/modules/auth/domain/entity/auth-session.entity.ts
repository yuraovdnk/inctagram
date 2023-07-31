import { UserEntity } from '../../../users/domain/entity/user.entity';
import { DeviceInfoType } from '../../../../core/common/decorators/device-info.decorator';
import { getLogger } from 'nodemailer/lib/shared';

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
}
