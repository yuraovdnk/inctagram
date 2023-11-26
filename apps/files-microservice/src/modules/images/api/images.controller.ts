import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UploadAvatarCommand } from '../application/use-cases/commands/upload-avatar-command.handler';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../libs/common/notification/notification-result';
import { FileUploadUserAvatar } from '../../../../../../libs/contracts/file/file.upload-user-avatar';
import { FileUploadPostImages } from 'libs/contracts/file/file.upload-post-images';
import { UploadPostImagesCommand } from '../application/use-cases/commands/upload-post-images.command.handler';
import { ImagesRepository } from '../infrastructure/images.repository';
import { FilesGetPostImages } from '../../../../../../libs/contracts/file/files.get-post-images';
import { FileStorageService } from '../infrastructure/file-storage.service';
import { FileDeleteUserAvatar } from '../../../../../../libs/contracts/file/file.delete-user-avatar';

@Controller()
export class ImagesController {
  constructor(
    private commandBus: CommandBus,
    private imagesRepository: ImagesRepository,
    private fileStorageService: FileStorageService,
  ) {}

  @MessagePattern(FileUploadUserAvatar.topic)
  async uploadUserAvatar(
    dto: FileUploadUserAvatar.Request,
  ): Promise<NotificationResult<FileUploadUserAvatar.Response>> {
    return this.commandBus.execute<UploadAvatarCommand, NotificationResult>(
      new UploadAvatarCommand(dto.userId, dto.file),
    );
  }

  @MessagePattern(FileUploadPostImages.topic)
  async uploadPostImages(
    dto: FileUploadPostImages.Request,
  ): Promise<FileUploadPostImages.Response> {
    return this.commandBus.execute<UploadPostImagesCommand, NotificationResult>(
      new UploadPostImagesCommand(dto.images, dto.postId, dto.userId),
    );
  }

  @MessagePattern(FilesGetPostImages.topic)
  async getPostImages(
    dto: FilesGetPostImages.Request,
  ): Promise<FilesGetPostImages.Response> {
    const posts = await this.imagesRepository.getPostImages(dto.postId);
    return new SuccessResult(posts);
  }

  @MessagePattern(FileDeleteUserAvatar.topic)
  async deleteUserAvatar(dto: FileDeleteUserAvatar.Request) {
    return this.fileStorageService.deleteUserAvatar(dto.filename);
  }
}
