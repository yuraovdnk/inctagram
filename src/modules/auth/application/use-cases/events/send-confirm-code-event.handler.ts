import { UserCreatedEvent } from '../../../../users/domain/events/user.created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { EmailConfirmationEntity } from '../../../domain/entity/email-confirmation.entity';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';
import { ResentedConfirmCodeEvent } from '../../../domain/events/resented-confirm-code.event';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';
import { UserEntity } from '../../../../users/domain/entity/user.entity';

@EventsHandler(UserCreatedEvent, ResentedConfirmCodeEvent)
export class SendConfirmCodeEventHandler<T extends { user: UserEntity }>
  implements IEventHandler<T>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
  ) {}

  async handle(event: T): Promise<NotificationResult<EmailConfirmationEntity>> {
    const { user } = event;
    await this.emailService.sendConfirmCode(
      user.username,
      user.email,
      'codeEntityRes.data.code',
    );

    return new SuccessResult();
  }
}
