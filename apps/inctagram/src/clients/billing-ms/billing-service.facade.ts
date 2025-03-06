import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { BillingCreateSubscription } from '../../../../../libs/contracts/billing/billing.create-subscription';
import { NotificationResult } from '../../../../../libs/common/notification/notification-result';

@Injectable()
export class BillingServiceFacade {
  constructor(@Inject('BILLING_SERVICE') private clientTCP: ClientProxy) {}

  queries: {};
  commands = {
    createSubscription: (dto: BillingCreateSubscription.Request) =>
      this.createSubscription(dto),
  };

  private async createSubscription(dto: BillingCreateSubscription.Request) {
    const res = await fetch('http://localhost:3001/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });

    const data: NotificationResult<BillingCreateSubscription.Response> =
      await res.json();

    return data;
    // const notificationResult = await lastValueFrom(
    //   this.clientTCP.send<
    //     NotificationResult<BillingCreateSubscription.Response>,
    //     BillingCreateSubscription.Request
    //   >(BillingCreateSubscription.topic, dto),
    // );
    // return notificationResult;
  }
}
