import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileStorageService } from '../../../infrastructure/file-storage.service';
import { ImagesRepository } from '../../../infrastructure/images.repository';
import { Inject } from '@nestjs/common';
import Piscina from 'piscina';
import { PostImage } from '../../../domain/entities/post-image.schema';
import {
  InternalServerError,
  NotificationResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';
import { ResizedPostImageDto } from '../../dtos/resized-post-image.dto';
import * as path from 'path';

export class UploadPostImagesCommand {
  constructor(
    public postImages: Express.Multer.File[],
    public postId: string,
    public userId: string,

  ) {}
}

@CommandHandler(UploadPostImagesCommand)
export class UploadPostImagesCommandHandler
  implements ICommandHandler<UploadPostImagesCommand>
{
  constructor(
    private fileService: FileStorageService,
    public imagesRepository: ImagesRepository,
    @Inject('WorkerPool') private workerPool: Piscina,
  ) {}

  async execute(command: UploadPostImagesCommand): Promise<NotificationResult> {
    const resizedPostImages: ResizedPostImageDto[] = await this.workerPool.run(
      command.postImages,
      {
        filename: path.join(__dirname, 'resize-post-images.js'),
      },
    );

    for (const [index, item] of resizedPostImages.entries()) {
      try {
        const resultUpload = await this.fileService.uploadPostImages(
          item,
          command.postId,
          index + 1,
        );
        if (resultUpload.hasError()) {
          throw new Error();
        }
        const model = new PostImage(
          command.postId,
          resultUpload.data.image,
          command.userId,
        );

        await this.imagesRepository.createPostImage(model);
      } catch (e) {
        return new InternalServerError(e);
      }
    }
    return new SuccessResult();
  }
}
