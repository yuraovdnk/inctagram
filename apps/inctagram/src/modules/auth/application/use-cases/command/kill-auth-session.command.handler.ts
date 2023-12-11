import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';

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
    return this.authRepository.deleteAuthSessionByDeviceId(command.deviceId);
  }
}
