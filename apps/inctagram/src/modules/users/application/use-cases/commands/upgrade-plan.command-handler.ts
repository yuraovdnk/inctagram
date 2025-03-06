import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../instrastructure/repository/users.repository';
import { BillingServiceFacade } from '../../../../../clients/billing-ms/billing-service.facade';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../../../../libs/common/notification/notification-codes.enum';

export class UpgradeAccountPlanCommand {
  constructor(public readonly userId: string, public readonly planId: string) {}
}

@CommandHandler(UpgradeAccountPlanCommand)
export class UpgradeAccountPlanCommandHandler
  implements ICommandHandler<UpgradeAccountPlanCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly billingServiceFacade: BillingServiceFacade,
  ) {}

  async execute(command: UpgradeAccountPlanCommand) {
    const { 0: user, 1: accountPlan } = await Promise.all([
      this.usersRepository.findById(command.userId),
      this.usersRepository.getAccountPlanById(command.planId),
    ]);

    if (!user) {
      return NotificationResult.Failure(
        NotificationCodesEnum.BAD_REQUEST,
        'user not found.',
      );
    }

    if (!accountPlan) {
      return NotificationResult.Failure(
        NotificationCodesEnum.BAD_REQUEST,
        'account plan not found.',
      );
    }

    const res = await this.billingServiceFacade.commands.createSubscription({
      planType: accountPlan.type,
      planId: accountPlan.id,
      userId: user.id,
      planPrice: Number(accountPlan.price) as number,
      description: accountPlan.description,
      paymentSystem: 'stripe',
      name: accountPlan.name,
    });

    return res;
  }
}
