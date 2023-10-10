import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UsersRepository } from '../../../instrastructure/repository/users.repository';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';
import { FileUploadUserAvatar } from '../../../../../../../../libs/contracts/file/file.upload-user-avatar';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';

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
    private filesServiceFacade: FilesServiceFacade,
  ) {}
  async execute(
    command: UploadUserAvatarCommand,
  ): Promise<NotificationResult<FileUploadUserAvatar.Response>> {
    const resultUploadFile =
      await this.filesServiceFacade.commands.uploadUserAvatar(
        command.userId,
        command.file,
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
