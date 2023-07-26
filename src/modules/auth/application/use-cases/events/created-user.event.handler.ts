import { UserCreatedEvent } from '../../../../users/domain/events/user.created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { EmailConfirmationEntity } from '../../../domain/entity/email-confirmation.entity';
import { EmailService } from '../../../../../core/adapters/mailer/mail.service';
import { BaseUseCase } from '../../../../../core/common/app/base.use-case';
import { PrismaService } from '../../../../../core/adapters/database/prisma/prisma.service';

@EventsHandler(UserCreatedEvent)
export class CreatedUserEventHandler
  extends BaseUseCase<UserCreatedEvent>
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly emailService: EmailService,
    protected prismaService: PrismaService,
  ) {
    super(prismaService);
  }

  async onExecute(event: UserCreatedEvent) {
    const { user } = event;
    const codeEntity = EmailConfirmationEntity.create(user.id);
    await Promise.all([
      this.authRepository.createEmailConfirmCode(
        this.prismaService,
        codeEntity,
      ),
      this.emailService.sendConfirmCode(
        user.username,
        user.email,
        codeEntity.code,
      ),
    ]);
  }
}
