import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { UploadAvatarCommand } from '../application/use-cases/commands/upload-avatar-command.handler';
import { NotificationResult } from '../../../../../../libs/common/notification/notification-result';
import { FileUploadUserAvatar } from '../../../../../../libs/contracts/file/file.upload-user-avatar';

@Controller()
export class AvatarsController {
  constructor(private commandBus: CommandBus) {}

  @MessagePattern(FileUploadUserAvatar.topic)
  async uploadUserAvatar(
    dto: FileUploadUserAvatar.Request,
  ): Promise<NotificationResult> {
    return this.commandBus.execute<UploadAvatarCommand, NotificationResult>(
      new UploadAvatarCommand(dto.userId, dto.file),
    );
  }
}
