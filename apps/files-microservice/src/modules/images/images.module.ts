import { Module } from '@nestjs/common';
import { AvatarsController } from './api/avatars.controller';
import { FileStorageService } from './infrastructure/file-storage.service';
import { CqrsModule } from '@nestjs/cqrs';
import { UploadAvatarCommandHandler } from './application/use-cases/commands/upload-avatar-command.handler';
const commands = [UploadAvatarCommandHandler];
@Module({
  imports: [CqrsModule],
  providers: [...commands, FileStorageService],
  controllers: [AvatarsController],
})
export class ImagesModule {}
