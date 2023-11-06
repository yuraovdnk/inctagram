import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { EmailService } from '../../../../../../../../libs/adapters/mailer/mail.service';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { PasswordRecoveryEntity } from '../../../domain/entity/password-recovery.entity';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';

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
    private eventBus: EventBus,
  ) {}
  async execute(command: PasswordRecoveryCommand): Promise<NotificationResult> {
    const { email } = command;
    const userEntity = await this.usersRepository.findByEmail(email);
    if (!userEntity || !userEntity.isConfirmedEmail) {
      return new SuccessResult();
    } //according to security requirements, in any case, we return a success result
    const passwordRecoveryEntity = PasswordRecoveryEntity.create(userEntity);
    await this.authRepository.createPasswordRecoveryCode(
      passwordRecoveryEntity,
    );
    passwordRecoveryEntity.getUncommittedEvents().forEach((event) => {
      this.eventBus.publish(event);
    });
    return new SuccessResult();
  }
}
