import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UsersRepository } from '../../instrastructure/repository/users.repository';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../../libs/common/notification/notification-result';
import { FileUploadUserAvatar } from '../../../../../../../libs/contracts/file/file.upload-user-avatar';

export class UploadUserAvatarCommand {
  constructor(
    public readonly userId: string,
    public readonly file: Express.Multer.File,
  ) {}
}

@CommandHandler(UploadUserAvatarCommand)
export class UploadUserAvatarCommandHandler
  implements ICommandHandler<UploadUserAvatarCommand>
{
  constructor(
    private userRepo: UsersRepository,
    @Inject('FILES_SERVICE') private clientTCP: ClientProxy,
  ) {}
  async execute(
    command: UploadUserAvatarCommand,
  ): Promise<NotificationResult<FileUploadUserAvatar.Response>> {
    const resultUploadFile = await lastValueFrom(
      this.clientTCP.send<
        NotificationResult<FileUploadUserAvatar.Response>,
        FileUploadUserAvatar.Request
      >(FileUploadUserAvatar.topic, {
        userId: command.userId,
        file: command.file,
      }),
    );

    if (!!resultUploadFile.extensions.length) {
      return resultUploadFile;
    }

    await this.userRepo.saveUserAvatar(
      command.userId,
      resultUploadFile.data.fileName,
    );

    return new SuccessResult(resultUploadFile.data);
  }
}
