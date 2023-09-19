import { PasswordRecoveryCode } from '@prisma/client';
import { PasswordRecoveryEntity } from '../domain/entity/password-recovery.entity';

export class PasswordRecoveryMapper {
  static toEntity(
    passwordRecoveryCode: PasswordRecoveryCode,
  ): PasswordRecoveryEntity {
    const entity = new PasswordRecoveryEntity();
    entity.userId = passwordRecoveryCode.userId;
    entity.createdAt = passwordRecoveryCode.createdAt;
    entity.code = passwordRecoveryCode.code;
    entity.expireAt = passwordRecoveryCode.expireAt;
    return entity;
  }
}
