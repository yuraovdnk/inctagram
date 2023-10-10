import { Post } from '@prisma/client';
import { PostEntity } from '../domain/post.entity';

export class PostMapper {
  // static toModel(userEntity: UserEntity): User {
  //   return {
  //     id: userEntity.id,
  //     email: userEntity.email,
  //     passwordHash: userEntity.passwordHash,
  //     username: userEntity.username,
  //     createdAt: userEntity.createdAt,
  //     isEmailConfirmed: userEntity.isConfirmedEmail,
  //   };
  // }
  static toEntity(user: Post): PostEntity {
    const entity = new PostEntity();
    entity.id = user.id;
    entity.userId = user.userId;
    entity.createdAt = user.createdAt;
    entity.description = user.description;
    entity.location = user.location;
    return entity;
  }
}
