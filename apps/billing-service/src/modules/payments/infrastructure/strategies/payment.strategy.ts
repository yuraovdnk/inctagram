export enum PAYMENT_METHOD {
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}
export abstract class PaymentStrategy {
  abstract processPayment(order: any): void;
}
