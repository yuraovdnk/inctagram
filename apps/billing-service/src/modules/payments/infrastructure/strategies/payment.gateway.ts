import { Injectable } from '@nestjs/common';
import { PAYMENT_METHOD, PaymentStrategy } from './payment.strategy';
import { StripeStrategy } from './stripe.strategy';

@Injectable()
export class PaymentGateway {
  private paymentStrategies: Partial<Record<PAYMENT_METHOD, PaymentStrategy>> =
    {};

  constructor(stripe: StripeStrategy) {
    this.paymentStrategies[PAYMENT_METHOD.STRIPE] = stripe as PaymentStrategy;
    //this.paymentStrategies[PAYMENT_METHOD.PayPal] = stripe as PaymentStrategy;
  }

  public async createPayment(
    order: any,
    paymentMethod: PAYMENT_METHOD,
  ): Promise<any> {
    const gateway = this.paymentStrategies[paymentMethod];
    if (gateway) {
      return gateway.processPayment(order);
    } else {
      throw new Error('Unsupported payment method!');
    }
  }
}
