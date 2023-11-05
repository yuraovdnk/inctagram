import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../instrastructure/repository/users.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';

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

  async execute(command: UploadUserAvatarCommand): Promise<NotificationResult> {
    const userProfile = await this.userRepo.getUserProfile(command.userId);
    if (!userProfile || !userProfile.profile) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_EXIST,
        'user or profile not found',
      );
    }
    const resultUploadFile =
      await this.filesServiceFacade.commands.uploadUserAvatar(
        command.userId,
        command.file,
      );

    if (!!resultUploadFile.extensions.length) {
      //TODO thinking about return error
      return NotificationResult.Failure(
        NotificationCodesEnum.ERROR,
        'something went wrong with uploading avatar',
      );
    }

    await this.userRepo.saveUserAvatar(
      command.userId,
      resultUploadFile.data.fileName,
    );

    return NotificationResult.Success();
  }
}
