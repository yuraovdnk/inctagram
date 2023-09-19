import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { PasswordRecoveryEvent } from '../../../domain/events/password-recovery.event';
import { EmailService } from '../../../../../../../../libs/adapters/mailer/mail.service';

@EventsHandler(PasswordRecoveryEvent)
export class PasswordRecoveryEventHandler implements IEventHandler {
  constructor(private emailService: EmailService) {}
  async handle(event: PasswordRecoveryEvent) {
    await this.emailService.sendPasswordRecoveryCodeEmail(
      event.userEntity.email,
      event.passwordRecoveryEntity.code,
    );
  }
}
