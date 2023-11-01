import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../instrastructure/repository/users.repository';
import { UserProfileDto } from '../../dto/request/user-profile.dto';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';

export class UpdateUserProfileCommand {
  constructor(
    public readonly updateDto: UserProfileDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileCommandHandler
  implements ICommandHandler<UpdateUserProfileCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(
    command: UpdateUserProfileCommand,
  ): Promise<NotificationResult> {
    const { userId, updateDto } = command;
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      return NotificationResult.Failure(
        NotificationCodesEnum.NOT_FOUND,
        'user not found',
      );
    }
    user.setProfile(updateDto);
    await this.usersRepository.upsertUserProfile(user);

    return NotificationResult.Success();
  }
}
