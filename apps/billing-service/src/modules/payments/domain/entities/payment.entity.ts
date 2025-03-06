import * as crypto from 'crypto';

export class PaymentEntity {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  userId: string;
  planId: string;
  paymentMethod: string | null;
  status: 'succeeded' | 'failed' | 'pending';
  transactionId: string | null;
  createdAt: Date;

  static create(
    amount: number,
    userId: string,
    planId: string,
    paymentMethod: string | null,
  ) {
    const payment = new PaymentEntity();
    payment.id = crypto.randomUUID();
    payment.amount = amount;
    payment.paymentMethod = paymentMethod;
    payment.planId = planId;
    payment.userId = userId;
    payment.currency = 'USD';
    payment.status = 'pending';
    payment.createdAt = new Date();
    return payment;
  }

  markAsSucceeded(transactionId: string): void {
    if (this.status !== 'pending') {
      throw new Error(
        'Payment status cannot be changed after it has been finalized.',
      );
    }
    this.status = 'succeeded';
    this.transactionId = transactionId;
  }
}
