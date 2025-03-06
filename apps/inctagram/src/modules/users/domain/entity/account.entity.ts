export class AccountEntity {
  public readonly id: string;
  public type: string;
  public readonly userId: string;
  public readonly planId: string = null;
  public createdAt: Date;
  public updatedAt: Date;

  private constructor(type: string, userId: string) {
    this.type = type;
    this.userId = userId;
  }

  static create(userId: string) {
    const startPlan = 'Personal';
    return new AccountEntity(startPlan, userId);
  }
}
