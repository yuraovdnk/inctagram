import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ResizedPostImageDto } from '../../application/dtos/resized-post-image.dto';
import { ImageVariants } from '../../application/types/post-image-types';

export type PostImageDocument = HydratedDocument<PostImage>;

@Schema()
export class ImageVersion {
  @Prop()
  size: number;
  
  @Prop()
  variant: ImageVariants;

  @Prop()
  url: string | null;

  constructor(size: number, variant: ImageVariants, url: string) {
    this.size = size;
    this.variant = variant;
    this.url = url;
  }
}
export const ImageVersionSchema = SchemaFactory.createForClass(ImageVersion);

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
