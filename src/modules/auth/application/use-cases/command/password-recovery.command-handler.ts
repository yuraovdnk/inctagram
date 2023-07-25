import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { v4 as uuidv4 } from 'uuid';
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
      if (!userEntity) {
        console.log(
          `[PasswordRecoveryCommand]: by email: ${email} user did not found`,
        );
        return;
      }
      const passwordRecoveryEntity = PasswordRecoveryEntity.create(
        userEntity.id,
      );
      const recoveryCode = uuidv4();
      await Promise.all([
        this.authRepository.createPasswordRecoveryCode(passwordRecoveryEntity),
        this.emailService.sendEmail(
          email,
          'Password recovery email',
          'password-recovery',
          { recoveryCode },
        ),
      ]);
      console.log(
        `[PasswordRecoveryCommand]: on email: ${email} sent letter with password recovery code`,
      );
    } catch (e) {
      console.error(`[mailService]: email sending error:`, e);
    }
  }
}
