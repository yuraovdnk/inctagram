import { ImageVariants } from '../types/post-image-types';

export class ResizedPostImageDto {
  originalName: string;
  images: {
    buffer: ArrayBufferLike;
    size: number;
    format: string;
    variant: ImageVariants;
    url: string | null;
  }[] = [];
}
