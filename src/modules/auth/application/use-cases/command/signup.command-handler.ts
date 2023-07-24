import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';

export class SignupCommand {
  constructor() {}
}

@CommandHandler(SignupCommand)
class SignupCommandHandler implements ICommandHandler {
  constructor(private authRepository: AuthRepository) {}
  async execute(command: SignupCommand): Promise<any> {
    ///
  }
}
