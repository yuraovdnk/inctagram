import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { BadRequestException } from '@nestjs/common';
import { mapErrors } from '../../../../../core/common/exception/validator-errors';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';

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
    console.log('sdfsdf');
    const confirmCode = await this.authRepository.findByConfirmCode(
      command.code,
    );

    if (!confirmCode)
      throw new BadRequestException(mapErrors('Code is incorrect', 'code'));

    if (confirmCode.user.isConfirmedEmail) throw new BadRequestException();

    if (confirmCode.expireAt < new Date()) throw new BadRequestException();

    confirmCode.user.confirmEmail();

    await this.usersRepository.update(confirmCode.user);
  }
}
