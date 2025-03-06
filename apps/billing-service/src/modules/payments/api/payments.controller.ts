import { Body, Controller, Post } from '@nestjs/common';
import { BillingCreateSubscription } from '../../../../../../libs/contracts/billing/billing.create-subscription';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '../application/commands/create.payment.command.handler';

@Controller()
export class PaymentsController {
  constructor(private commandBus: CommandBus) {}

  @Post('payment')
  async test(@Body() dto: BillingCreateSubscription.Request) {
    return this.commandBus.execute(new CreatePaymentCommand(dto));
  }
}
