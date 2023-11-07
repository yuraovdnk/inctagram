import sharp from 'sharp';
import { ResizedPostImageDto } from '../../dtos/resized-post-image.dto';
import { ImageVariants } from '../../types/post-image-types';

export default async (
  originalImages: Express.Multer.File[],
): Promise<ResizedPostImageDto[]> => {
  const resizedImages: ResizedPostImageDto[] = [];

  for (let i = 0; i < originalImages.length; i++) {
    console.log(originalImages[i].buffer['data'], 'dsfsdfds');
    const [large, medium] = await Promise.all([
      sharp(Buffer.from(originalImages[i].buffer['data']))
        .jpeg()
        .toBuffer({ resolveWithObject: true }),

      sharp(Buffer.from(originalImages[i].buffer['data']))
        .resize({
          width: 320,
          height: 320,
          fit: 'contain',
        })
        .jpeg()
        .toBuffer({ resolveWithObject: true }),
    ]);

    resizedImages.push({
      originalName: originalImages[i].originalname,
      images: [
        createImageVariant(ImageVariants.Medium, medium),
        createImageVariant(ImageVariants.Large, large),
      ],
    });
  }
  return resizedImages;
};

function createImageVariant(
  variant: ImageVariants,
  data: {
    data: Buffer;
    info: sharp.OutputInfo;
  },
) {
  return {
    variant,
    format: data.info.format,
    size: data.info.size,
    buffer: data.data.buffer,
    url: null,
  };
}
