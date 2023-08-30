import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { BadRequestException } from '@nestjs/common';
import { mapErrors } from '../../../../../core/common/exception/validator-errors';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import {
  BadResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';

export class EmailConfirmCommand {
  constructor(public readonly code: string) {}
}
@CommandHandler(EmailConfirmCommand)
export class EmailConfirmCommandHandler
  implements ICommandHandler<EmailConfirmCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: EmailConfirmCommand): Promise<any> {
    const confirmCode = await this.authRepository.findByConfirmCode(
      command.code,
    );

    if (!confirmCode) return new BadResult('Code is incorrect', 'code');

    if (confirmCode.user.isConfirmedEmail)
      return new BadResult('email is already confirmed');

    if (confirmCode.expireAt < new Date())
      return new BadResult('email confirmation code is expired');

    confirmCode.user.confirmEmail();

    await this.usersRepository.update(confirmCode.user);
    return new SuccessResult();
  }
}
