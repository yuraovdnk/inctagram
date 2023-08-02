import { mapErrors } from '../../../../../core/common/exception/validator-errors';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { SignUpDto } from '../../dto/request/signUp.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
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
    if (command.signupDto.password !== command.signupDto.passwordConfirm) {
      throw new BadRequestException(
        mapErrors(
          'Password confirmation must match the password',
          'passwordConfirm',
        ),
      );
    }
    const [userByEmail, userByUsername] = await Promise.all([
      this.authRepository.findByEmail(command.signupDto.email),
      this.authRepository.findByUsername(command.signupDto.username),
    ]);

    if (userByEmail || userByUsername) {
      throw new BadRequestException(
        mapErrors(
          'User with this email is already registered',
          'login or username',
        ),
      );
    }

    const passwordHash = bcrypt.hashSync(command.signupDto.password, 10); //TODO env

    const user = UserEntity.create(
      command.signupDto.username,
      command.signupDto.email,
      passwordHash,
    );

    await this.authRepository.create(user);

    user.getUncommittedEvents().forEach((event) => {
      this.eventBus.publish(event);
    });
  }
}
