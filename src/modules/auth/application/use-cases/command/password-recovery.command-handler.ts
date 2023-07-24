import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { MailService } from '../../../../mailer/mail.service';
import { v4 as uuidv4 } from 'uuid';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService, // private passwordRecoveryRepo: PasswordRecoveryRepository,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<boolean> {
    try {
      const { email } = command;
      // const userModel = await this.userQueryRepository.findUserByLoginOrEmail(
      //   email,
      // );
      // if (!userModel) {
      //   return false;
      // }
      const recoveryCode = uuidv4();
      await Promise.all([
        //this.passwordRecoveryRepo.create(passwordRecoveryEntity),
        this.mailService.sendEmail(
          email,
          'Password recovery email',
          'password-recovery',
          { recoveryCode },
        ),
      ]);
      console.log(`[mailService]: email has been sent`);
      return true;
    } catch (e) {
      console.error(`[mailService]: email sending error:`, e);
      return false;
    }
  }
}

