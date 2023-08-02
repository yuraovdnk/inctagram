import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';

export class KillAuthSessionCommand {
  constructor() {}
}

@CommandHandler(KillAuthSessionCommand)
export class KillAuthSessionCommandHandler
  implements ICommandHandler<ICommandHandler>
{
  constructor(private authRepository: AuthRepository) {}
  async execute(command: ICommandHandler) {}
}
