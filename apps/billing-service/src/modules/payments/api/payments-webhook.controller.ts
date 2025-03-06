import {
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { NotificationResult } from '../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../libs/common/notification/notification-codes.enum';
import { StripeStrategy } from '../infrastructure/strategies/stripe.strategy';
import { CommandBus } from '@nestjs/cqrs';
import { CompletePaymentCommand } from '../application/commands/complete.payment.command.handler';

@Controller('webhook')
export class PaymentsWebhookController {
  constructor(
    private readonly stripeStrategy: StripeStrategy,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('success')
  async success() {
    console.log('payment success');
    return true;
  }

  @Post('stripe')
  async handleStripeEvents(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    if (!signature) {
      return NotificationResult.Failure(
        NotificationCodesEnum.BAD_REQUEST,
        'Missing stripe-signature header',
      );
    }

    try {
      const event = this.stripeStrategy.constructEvent(
        request.rawBody,
        signature,
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        const res = await this.commandBus.execute(
          new CompletePaymentCommand(session.metadata.paymentId, session.id),
        );
      }
    } catch (e) {
      return NotificationResult.Failure(
        NotificationCodesEnum.ERROR,
        'webhook error',
      );
    }
  }
}
