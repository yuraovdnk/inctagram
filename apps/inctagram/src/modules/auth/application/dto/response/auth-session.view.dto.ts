import { AuthSessionEntity } from '../../../domain/entity/auth-session.entity';

export class AuthSessionViewDto {
  deviceId: string;
  deviceName: string;
  ip: string;
  lastVisit: Date;
  constructor(authSessionEntity: AuthSessionEntity) {
    this.deviceId = authSessionEntity.deviceId;
    this.deviceName = authSessionEntity.deviceName;
    this.ip = authSessionEntity.ip;
    this.lastVisit = authSessionEntity.issuedAt;
  }
}
