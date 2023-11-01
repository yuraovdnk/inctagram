import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ImageVariants } from '../../application/types/post-image-types';

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
