import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';

export class KillAuthSessionCommand {
  constructor(
    public readonly userId: string,
    public readonly deviceId: string,
  ) {}
}

@CommandHandler(KillAuthSessionCommand)
export class KillAuthSessionCommandHandler
  implements ICommandHandler<KillAuthSessionCommand>
{
  constructor(private authRepository: AuthRepository) {}
  async execute(command: KillAuthSessionCommand) {
    const authSession = await this.authRepository.findAuthSessionByDeviceId(
      command.deviceId,
    );
    if (authSession.userId !== command.userId) {
      return NotificationResult.Failure(
        NotificationCodesEnum.FORBIDDEN,
        'You try to kill other user`s session',
      );
    }
    await this.authRepository.deleteAuthSessionByDeviceId(command.deviceId);
    return NotificationResult.Success();
  }
}
