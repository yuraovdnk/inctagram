import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { SignUpDto } from '../../dto/request/sign-up.dto';
import {
  BadResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';
import { AuthService } from '../../service/auth.service';
import { EmailConfirmationEntity } from '../../../domain/entity/email-confirmation.entity';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { BaseUseCase } from '../../../../../../../../libs/common/app/base.use-case';
import { TransactionScope } from '../../../../../../../../libs/adapters/db/transaction-scope';

export class SignupCommand {
  constructor(public readonly signupDto: SignUpDto) {}
}

@CommandHandler(SignupCommand)
export class SignupCommandHandler
  extends BaseUseCase<SignupCommand>
  implements ICommandHandler<SignupCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private authRepository: AuthRepository,
    private authService: AuthService,
    eventBus: EventBus,
    prismaTransactionScope: TransactionScope,
  ) {
    super(eventBus, prismaTransactionScope);
  }

  protected async onExecute(message: SignupCommand) {
    const [userByEmail, userByUsername] = await Promise.all([
      this.usersRepository.findByConfirmedEmail(message.signupDto.email),
      this.usersRepository.findByUsernameConfirmedEmail(
        message.signupDto.username,
      ),
    ]);

    if (userByEmail || userByUsername) {
      return new BadResult(
        'User with this email or username is already registered',
        'email or username',
      );
    }

    await this.usersRepository.deleteUserUnconfirmedEmail(
      message.signupDto.email,
      message.signupDto.username,
    );

    const passwordHash = this.authService.getPasswordHash(
      message.signupDto.password,
    );

    const user = UserEntity.create(
      message.signupDto.username,
      message.signupDto.email,
      passwordHash,
    );

    await this.usersRepository.create(user);

    const codeEntityRes = EmailConfirmationEntity.create(user);

    await this.authRepository.createEmailConfirmCode(codeEntityRes.data);

    const events = user.getUncommittedEvents();

    return new SuccessResult({ email: user.email }, events);
  }
}
