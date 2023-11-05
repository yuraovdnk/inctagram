import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../instrastructure/repository/users.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';
import { FilesServiceFacade } from '../../../../../clients/files-ms/files-service.fasade';

export class DeleteAvatarCommand {
  constructor(public readonly userId: string) {}
}

@CommandHandler(DeleteAvatarCommand)
export class DeleteAvatarCommandHandler
  implements ICommandHandler<DeleteAvatarCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private filesServiceFacade: FilesServiceFacade,
  ) {}

  async execute(command: DeleteAvatarCommand) {
    const userProfile = await this.usersRepository.getUserProfile(
      command.userId,
    );

    if (!userProfile.profile) {
      return NotificationResult.Failure(
        NotificationCodesEnum.FORBIDDEN,
        'profile is not created',
      );
    }

    const resultDeleting =
      await this.filesServiceFacade.commands.deleteUserAvatar(
        userProfile.profile.avatar,
      );

    if (!!resultDeleting.extensions.length) {
      return resultDeleting;
    }

    await this.usersRepository.deleteUserAvatar(userProfile);
    return NotificationResult.Success();
  }
}
