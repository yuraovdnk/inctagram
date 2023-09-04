import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../instrastructure/repository/users.repository';
import { UserProfileDto } from '../dto/request/user-profile.dto';
import { SuccessResult } from '../../../../core/common/notification/notification-result';
import { BadRequestException } from '@nestjs/common';

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

  async execute(command: UpdateUserProfileCommand) {
    const { userId, updateDto } = command;
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new BadRequestException();
    user.setProfile(updateDto);
    await this.usersRepository.upsertUserProfile(user);
    return new SuccessResult();
  }
}
