import { UserEntity } from '../domain/entity/user.entity';
import {
  EmailConfirmationCode,
  ExternalAccount,
  Prisma,
  User,
} from '@prisma/client';

export type UserFullType = Prisma.UserGetPayload<{
  select: { [K in keyof Required<Prisma.UserSelect>]: true };
}>;

type UserType = User & {
  externalAccounts?: ExternalAccount[];
  emailConfirmationCode?: EmailConfirmationCode;
};

export class UserMapper {
  static toModel(userEntity: UserEntity): User {
    return {
      id: userEntity.id,
      email: userEntity.email,
      passwordHash: userEntity.passwordHash,
      username: userEntity.username,
      createdAt: userEntity.createdAt,
      isEmailConfirmed: userEntity.isConfirmedEmail,
    };
  }
  static toEntity(user: UserType) {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.username = user.username;
    entity.createdAt = user.createdAt;
    entity.isConfirmedEmail = user.isEmailConfirmed;
    entity.externalAccounts.push(...(user.externalAccounts || []));

    return entity;
  }
}
