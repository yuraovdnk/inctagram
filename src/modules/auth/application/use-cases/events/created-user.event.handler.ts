import { UserCreatedEvent } from '../../../../users/domain/events/user.created.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import { AuthRepository } from '../../../infrastructure/repository/auth.repository';
import { EmailConfirmationEntity } from '../../../domain/entity/email-confirmation.entity';

@EventsHandler(UserCreatedEvent)
export class CreatedUserEventHandler
  implements IEventHandler<UserCreatedEvent>
{
  constructor(
    private repository: UsersRepository,
    private authRepository: AuthRepository,
  ) {}

  async handle(event: UserCreatedEvent) {
    const { userId, email } = event;
    const code = EmailConfirmationEntity.create(userId);
    await this.authRepository.createEmailConfirmCode(code);
  }
}
