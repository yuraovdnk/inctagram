import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BillingCreateSubscription } from '../../../../../../../libs/contracts/billing/billing.create-subscription';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PAYMENT_METHOD } from '../../infrastructure/strategies/payment.strategy';
import { PaymentsRepository } from '../../infrastructure/repos/payments.repository';
import { PaymentGateway } from '../../infrastructure/strategies/payment.gateway';

export class CreatePaymentCommand {
  constructor(
    public readonly createPaymentDto: BillingCreateSubscription.Request,
  ) {}
}

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentCommandHandler
  implements ICommandHandler<CreatePaymentCommand>
{
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  async execute(command: CreatePaymentCommand) {
    //with transaction
    const paymentEntity = PaymentEntity.create(
      command.createPaymentDto.planPrice,
      command.createPaymentDto.userId,
      command.createPaymentDto.planId,
      command.createPaymentDto.paymentSystem,
    );

    const payment = await this.paymentsRepository.save(paymentEntity);

    const stripePayload = {
      description: command.createPaymentDto.description,
      name: command.createPaymentDto.name,
      paymentId: paymentEntity.id,
    };

    const result = await this.paymentGateway.createPayment(
      stripePayload,
      command.createPaymentDto.paymentSystem as PAYMENT_METHOD,
    );
    return result;
  }
}
