import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { PasswordRecoveryEntity } from '../../../domain/entity/password-recovery.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { mapErrors } from '../../../../../core/common/exception/validator-errors';
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
    private readonly configService: ConfigService,
  ) {}
  async execute(command: NewPasswordCommand): Promise<void> {
    const { newPassword, recoveryCode } = command;
    const passwordRecoveryEntity: PasswordRecoveryEntity =
      await this.authRepository.findPasswordRecovery(recoveryCode);
    if (!passwordRecoveryEntity) {
      console.error(
        `[NewPasswordCommandHandler]: by code:${recoveryCode} did not find a valid code`,
      );
      throw new BadRequestException(
        mapErrors('password recovery code is wrong', 'code'),
      );
    }

    const userEntity = await this.usersRepository.findById(
      passwordRecoveryEntity.userId,
    );
    const salt = this.configService.get('SALT_HASH');
    userEntity.passwordHash = bcrypt.hashSync(newPassword, salt);
    const res = await this.usersRepository.updatePassword(userEntity);
    //Обработать кейс если пароль не обновился
    if (!res) throw new InternalServerErrorException();
  }
}
