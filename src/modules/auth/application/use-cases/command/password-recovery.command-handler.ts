import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { PasswordRecoveryEntity } from '../../../domain/entity/password-recovery.entity';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<void> {
    try {
      const { email } = command;
      const userEntity = await this.usersRepository.findByEmail(email);
      if (!userEntity || !userEntity.isConfirmedEmail) {
        console.error(
          `[PasswordRecoveryCommand]: by email: ${email} user did not found`,
        );
        return;
      }
      const passwordRecoveryEntity = PasswordRecoveryEntity.create(
        userEntity.id,
      );
      await Promise.all([
        this.authRepository.createPasswordRecoveryCode(passwordRecoveryEntity),
        this.emailService.sendPasswordRecoveryCodeEmail(
          email,
          passwordRecoveryEntity.code,
        ),
      ]);
    } catch (e) {
      console.error(`[mailService]: email sending error:`, e);
    }
  }
}
