import { UserEntity } from '../domain/entity/user.entity';
import { User } from '@prisma/client';

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
  static toEntity(user: User) {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.username = user.username;
    entity.createdAt = user.createdAt;
    entity.isConfirmedEmail = user.isEmailConfirmed;

    return entity;
  }
}
