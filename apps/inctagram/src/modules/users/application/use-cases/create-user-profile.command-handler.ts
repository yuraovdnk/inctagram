import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../instrastructure/repository/users.repository';
import { UserProfileDto } from '../dto/request/user-profile.dto';
import { SuccessResult } from '../../../../../../../libs/common/notification/notification-result';
import { BadRequestException } from '@nestjs/common';

export class CreateUserProfileCommand {
  constructor(
    public readonly createDto: UserProfileDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateUserProfileCommand)
export class CreateUserProfileCommandHandler
  implements ICommandHandler<CreateUserProfileCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: CreateUserProfileCommand) {
    const { userId, createDto } = command;
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new BadRequestException();
    user.setProfile(createDto);
    await this.usersRepository.upsertUserProfile(user);
    return new SuccessResult();
  }
}
