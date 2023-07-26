import { UserEntity } from '../domain/entity/user.entity';
import { User } from '@prisma/client';

export class UserMapper {
  static toEntity(user: User) {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.username = user.username;
    entity.createdAt = user.createdAt;
    return entity;
  }
}
