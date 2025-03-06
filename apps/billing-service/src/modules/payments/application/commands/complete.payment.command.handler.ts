import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentsRepository } from '../../infrastructure/repos/payments.repository';
import { RMQService } from 'nestjs-rmq';

export class CompletePaymentCommand {
  constructor(
    public readonly id: string,
    public readonly transactionId: string,
  ) {}
}

@CommandHandler(CompletePaymentCommand)
export class CompletePaymentCommandHandler
  implements ICommandHandler<CompletePaymentCommand>
{
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly rmqService: RMQService,
  ) {}

  async execute(command: CompletePaymentCommand) {
    const payment = await this.paymentsRepository.getById(command.id);
    payment.markAsSucceeded(command.transactionId);
    await this.paymentsRepository.save(payment);

    await this.rmqService.send('account.updated', {
      userId: payment.userId,
      planId: payment.planId,
    });
  }
}
