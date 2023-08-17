import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ResendConfirmationEmailDto } from '../../dto/request/resend-confirmation-email.dto';
import { UsersRepository } from '../../../../users/instrastructure/repository/users.repository';
import {
  ForbiddenResult,
  NotFoundResult,
  NotificationResult,
  SuccessResult,
} from '../../../../../core/common/notification/notification-result';
import { ResentedConfirmCodeEvent } from '../../../domain/events/resented-confirm-code.event';

export class ResendEmailConfirmationCommand {
  constructor(
    public readonly resendConfirmationEmailDto: ResendConfirmationEmailDto,
  ) {}
}
@CommandHandler(ResendEmailConfirmationCommand)
export class ResendEmailConfirmationCommandHandler
  implements ICommandHandler<ResendEmailConfirmationCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    message: ResendEmailConfirmationCommand,
  ): Promise<NotificationResult> {
    const user = await this.usersRepository.findByEmail(
      message.resendConfirmationEmailDto.email,
    );
    if (!user) {
      return new NotFoundResult('user not found'); //show stack error if  it throws in app
    }

    if (user.isConfirmedEmail) {
      return new ForbiddenResult('user is already confirmed');
    }

    this.eventBus.publish(new ResentedConfirmCodeEvent(user));
    return new SuccessResult();
  }
}
