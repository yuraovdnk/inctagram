import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryCommandHandler
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authRepository: AuthRepository, // private readonly mailService: MailService, // private userQueryRepository: UsersQueryTypeormRepository,
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
      // const recoveryCode = userModel.generateNewPasswordRecoveryCode();
      // await Promise.all([
      //   await this.userRepository.save(userModel),
      //   await this.mailService.sendPasswordRecoveryEmail(email, recoveryCode),
      // ]);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
