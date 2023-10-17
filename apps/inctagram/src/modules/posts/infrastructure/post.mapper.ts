import { Post } from '@prisma/client';
import { PostEntity } from '../domain/post.entity';

export class PostMapper {
  static toModel(postEntity: PostEntity): Post {
    return {
      id: postEntity.id,
      userId: postEntity.userId,
      deleted: postEntity.deleted,
      description: postEntity.description,
      location: postEntity.location,
      createdAt: postEntity.createdAt,
    };
  }
  static toEntity(user: Post): PostEntity {
    const entity = new PostEntity();
    entity.id = user.id;
    entity.userId = user.userId;
    entity.createdAt = user.createdAt;
    entity.description = user.description;
    entity.deleted = user.deleted;
    entity.location = user.location;
    return entity;
  }
}
