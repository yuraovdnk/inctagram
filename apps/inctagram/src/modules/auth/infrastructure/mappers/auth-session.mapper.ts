import { AuthSession } from '@prisma/client';
import { AuthSessionEntity } from '../../domain/entity/auth-session.entity';

export class AuthSessionMapper {
  static toModel(authSessionEntity: AuthSessionEntity): AuthSession {
    return {
      id: authSessionEntity.id,
      deviceId: authSessionEntity.deviceId,
      deviceName: authSessionEntity.deviceName,
      userId: authSessionEntity.userId,
      issuedAt: authSessionEntity.issuedAt,
      expireAt: authSessionEntity.expireAt,
      ip: authSessionEntity.ip,
    };
  }
  static toEntity(authSessionModel: AuthSession) {
    const authSessionEntity = new AuthSessionEntity();
    authSessionEntity.id = authSessionModel.id;
    authSessionEntity.userId = authSessionModel.userId;
    authSessionEntity.deviceId = authSessionModel.deviceId;
    authSessionEntity.deviceName = authSessionModel.deviceName;
    authSessionEntity.expireAt = authSessionModel.expireAt;
    authSessionEntity.issuedAt = authSessionModel.issuedAt;
    authSessionEntity.ip = authSessionModel.ip;
    return authSessionEntity;
  }
}
