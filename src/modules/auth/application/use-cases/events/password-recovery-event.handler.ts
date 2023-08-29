import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';
import { PasswordRecoveryEvent } from '../../../domain/events/password-recovery.event';

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
