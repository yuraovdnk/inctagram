import { Module } from '@nestjs/common';
import { AvatarsController } from './api/avatars.controller';
import { FileStorageService } from './infrastructure/file-storage.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadAvatarCommandHandler } from './application/use-cases/commands/upload-avatar-command.handler';
import { UploadPostImagesCommandHandler } from './application/use-cases/commands/upload-post-images.command.handler';
import { ImageCompressor } from './image.compressor';
const commands = [UploadAvatarCommandHandler, UploadPostImagesCommandHandler];
@Module({
  imports: [CqrsModule],
  providers: [...commands, FileStorageService, ImageCompressor],
  controllers: [AvatarsController],
})
export class ImagesModule {}
