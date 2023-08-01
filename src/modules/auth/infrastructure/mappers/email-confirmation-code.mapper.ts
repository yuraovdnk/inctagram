import { EmailConfirmationCode, User } from '@prisma/client';
import { EmailConfirmationEntity } from '../../domain/entity/email-confirmation.entity';
import { UserMapper } from '../../../users/instrastructure/user.mapper';

type EmailConfirmationCodeFullType = EmailConfirmationCode & {
  user: User;
};
export class EmailConfirmationCodeMapper {
  static toModel(entity: EmailConfirmationEntity): EmailConfirmationCode {
    return {
      userId: entity.userId,
      code: entity.code,
      expireAt: entity.expireAt,
      createdAt: entity.createdAt,
    };
  }
  static toEntity(
    model: EmailConfirmationCodeFullType,
  ): EmailConfirmationEntity {
    const entity = new EmailConfirmationEntity();
    entity.code = model.code;
    entity.userId = model.userId;
    entity.expireAt = model.expireAt;
    entity.user = UserMapper.toEntity(model.user);
    return entity;
  }
}
