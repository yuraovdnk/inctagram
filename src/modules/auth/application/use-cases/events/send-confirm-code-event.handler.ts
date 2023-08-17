import { UserCreatedEvent } from '../../../../users/domain/events/user.created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { EmailConfirmationEntity } from '../../../domain/entity/email-confirmation.entity';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';
import { BaseUseCase } from '../../../../../core/common/app/base.use-case';
import { PrismaService } from '../../../../../core/adapters/database/prisma/prisma.service';
import { ResentedConfirmCodeEvent } from '../../../domain/events/resented-confirm-code.event';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';
import { UserEntity } from '../../../../users/domain/entity/user.entity';

@EventsHandler(UserCreatedEvent, ResentedConfirmCodeEvent)
export class SendConfirmCodeEventHandler<T extends { user: UserEntity }>
  extends BaseUseCase<T>
  implements IEventHandler<T>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
    protected prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  async onExecute(
    event: T,
  ): Promise<NotificationResult<EmailConfirmationEntity>> {
    const { user } = event;
    const codeEntityRes = EmailConfirmationEntity.create(user.id);
    if (codeEntityRes.hasError()) {
      return codeEntityRes;
    }

    await Promise.all([
      this.authRepository.createEmailConfirmCode(
        codeEntityRes.data,
        this.prismaService,
      ),
      this.emailService.sendConfirmCode(
        user.username,
        user.email,
        codeEntityRes.data.code,
      ),
    ]);

    return new SuccessResult();
  }
}
