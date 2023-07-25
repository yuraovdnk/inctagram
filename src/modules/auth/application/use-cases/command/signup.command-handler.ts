import { mapErrors } from '../../../../../core/common/exception/validator-errors';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { SignUpDto } from '../../dto/signUp.dto';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import * as bcrypt from 'bcrypt';
export class SignupCommand {
  constructor(public readonly signupDto: SignUpDto) {}
}

@CommandHandler(SignupCommand)
export class SignupCommandHandler implements ICommandHandler<SignupCommand> {
  constructor(
    private authRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(command: SignupCommand): Promise<void> {
    const [userByEmail, userByUsername] = await Promise.all([
      this.authRepository.findByEmail(command.signupDto.email),
      this.authRepository.findByUsername(command.signupDto.username),
    ]);

    if (userByEmail || userByUsername) {
      throw new BadRequestException(
        mapErrors('user is exist', 'login or username'),
      );
    }

    const passwordHash = await bcrypt.hash(command.signupDto.password, 10);

    const user = UserEntity.create(
      command.signupDto.email,
      command.signupDto.username,
      passwordHash,
    );
    await this.authRepository.create(user);

    user.getUncommittedEvents().forEach((event) => {
      this.eventBus.publish(event);
    });
  }
}
