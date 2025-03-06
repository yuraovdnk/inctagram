import { PaymentStrategy } from './payment.strategy';
import { Stripe } from 'stripe';
import process from 'process';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeStrategy implements PaymentStrategy {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  processPayment(productData: any) {
    //TODO rewrite
    return this.stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: 'http://localhost:3001/webhook/success',
      metadata: {
        paymentId: productData.paymentId,
      },
      line_items: [
        {
          price_data: {
            product_data: {
              name: productData.name || 'sfsdfsdfds',
              description: productData.description,
            },
            unit_amount: 100,
            currency: 'USD',
          },
          quantity: 1,
        },
      ],
    });
  }

  constructEvent(payload: Buffer, signature: string) {
    const event = this.stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    return event;
  }
}
