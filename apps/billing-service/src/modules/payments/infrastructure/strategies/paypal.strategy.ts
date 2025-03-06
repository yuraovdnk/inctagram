import { PaymentStrategy } from './payment.strategy';

export class PaypalStrategy implements PaymentStrategy {
  processPayment(order: any): void {}
}
