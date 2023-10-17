import { PostEntity } from '../../domain/post.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PostImageViewModel } from '../../../../../../../libs/dtos/post-image.view-model';

export class PostViewModel {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string | null;

  @ApiProperty({ type: PostImageViewModel, isArray: true })
  images: PostImageViewModel[] = [];

  constructor(post: PostEntity) {
    this.id = post.id;
    this.userId = post.userId;
    this.createdAt = post.createdAt;
    this.description = post.description;
    this.location = post.location;
    this.images.push(...post.images);
  }
}
