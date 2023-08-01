import { AuthSession } from '@prisma/client';
import { AuthSessionEntity } from '../../domain/entity/auth-session.entity';

export class AuthSessionMapper {
  static toModel(authSessionEntity: AuthSessionEntity): AuthSession {
    return {
      id: authSessionEntity.id,
      deviceId: authSessionEntity.deviceId,
      userId: authSessionEntity.userId,
      deviceName: authSessionEntity.deviceName,
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
    authSessionEntity.expireAt = authSessionModel.expireAt;
    authSessionEntity.issuedAt = authSessionModel.issuedAt;
    authSessionEntity.deviceName = authSessionModel.deviceName;
    return authSessionEntity;
  }
}
