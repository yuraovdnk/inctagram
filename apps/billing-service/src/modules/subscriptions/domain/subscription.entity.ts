export class SubscriptionEntity {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;

  constructor(
    id: string,
    userId: string,
    planId: string,
    status: 'active' | 'canceled' | 'expired',
    startDate: Date,
    endDate: Date,
    autoRenew = false,
    createdAt: Date = new Date(),
  ) {
    this.id = id;
    this.userId = userId;
    this.planId = planId;
    this.status = status;
    this.startDate = startDate;
    this.endDate = endDate;
    this.autoRenew = autoRenew;
    this.createdAt = createdAt;
  }
}
