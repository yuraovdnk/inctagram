import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ResizedPostImageDto } from '../../application/dtos/resized-post-image.dto';
import { ImageVersion, ImageVersionSchema } from './image-version.schema';

export type PostImageDocument = HydratedDocument<PostImage>;

@Schema({ versionKey: false })
export class PostImage {
  @Prop()
  userId: string;

  @Prop()
  postId: string;

  @Prop({ default: () => Date.now() })
  addedAt: Date;

  @Prop({ type: [ImageVersionSchema] })
  versions: ImageVersion[] = [];

  constructor(postId: string, image: ResizedPostImageDto, userId: string) {
    this.postId = postId;
    this.userId = userId;
    this.versions = image.images.map((i) => {
      return new ImageVersion(i.size, i.variant, i.url);
    });
  }
}
export const PostImageSchema = SchemaFactory.createForClass(PostImage);
