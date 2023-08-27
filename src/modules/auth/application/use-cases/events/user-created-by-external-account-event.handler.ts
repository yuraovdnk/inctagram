import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedByExternalAccountEvent } from '../../../domain/events/user-created-by-external-account.event';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';

@EventsHandler(UserCreatedByExternalAccountEvent)
export class UserCreatedByExternalAccountEventHandler implements IEventHandler {
  constructor(private emailService: EmailService) {}
  async handle(event: UserCreatedByExternalAccountEvent) {
    await this.emailService.sendMailWithSuccessRegistration(event.user.email);
  }
}
