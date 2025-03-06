export namespace BillingCreateSubscription {
  export const topic = 'bill.create-subscription';
  export class Request {
    planId: string;
    planPrice: number;
    planType: string;
    description: string;
    name: string;
    userId: string;
    paymentSystem: string;
  }
  export class Response {
    paymentUrl: string;
  }
}
