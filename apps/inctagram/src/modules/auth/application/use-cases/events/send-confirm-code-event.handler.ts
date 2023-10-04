import { UserCreatedEvent } from '../../../../users/domain/events/user.created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailConfirmationEntity } from '../../../domain/entity/email-confirmation.entity';
import { ResentedConfirmCodeEvent } from '../../../domain/events/resented-confirm-code.event';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../../../../libs/common/notification/notification-result';
import { UserEntity } from '../../../../users/domain/entity/user.entity';
import { EmailService } from '../../../../../../../../libs/adapters/mailer/mail.service';

@EventsHandler(UserCreatedEvent, ResentedConfirmCodeEvent)
export class SendConfirmCodeEventHandler<
  T extends { user: UserEntity; code: string },
> implements IEventHandler<T>
{
  constructor(private readonly emailService: EmailService) {}

  async handle(event: T): Promise<NotificationResult<EmailConfirmationEntity>> {
    const { user, code } = event;
    await this.emailService.sendConfirmCode(user.username, user.email, code);

    return new SuccessResult();
  }
}
