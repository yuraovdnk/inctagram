import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { PasswordRecoveryEntity } from '../../../domain/entity/password-recovery.entity';
import { BadRequestException } from '@nestjs/common';
import { mapErrors } from '../../../../../../../../libs/common/exception/validator-errors';
import { AuthService } from '../../service/auth.service';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';
export class NewPasswordCommand {
  constructor(public newPassword: string, public recoveryCode: string) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordCommandHandler
  implements ICommandHandler<NewPasswordCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(command: NewPasswordCommand): Promise<NotificationResult> {
    const { newPassword, recoveryCode } = command;
    const passwordRecoveryEntity: PasswordRecoveryEntity =
      await this.authRepository.findPasswordRecovery(recoveryCode);
    if (!passwordRecoveryEntity) {
      throw new BadRequestException(
        mapErrors('password recovery code is wrong', 'code'),
      );
    }

    const userEntity = await this.usersRepository.findById(
      passwordRecoveryEntity.userId,
    );

    userEntity.passwordHash = this.authService.getPasswordHash(newPassword);
    await this.usersRepository.updatePassword(userEntity);
    return new SuccessResult();
  }
}
