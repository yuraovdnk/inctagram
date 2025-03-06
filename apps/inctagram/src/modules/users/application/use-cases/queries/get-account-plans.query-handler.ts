import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../instrastructure/repository/users.repository';
import { AccountPlansViewDto } from '../../../../auth/application/dto/response/account-plans.view.dto';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';

export class GetAccountPlans {}

@QueryHandler(GetAccountPlans)
export class GetAccountPlansQueryHandler
  implements IQueryHandler<GetAccountPlans>
{
  constructor(private readonly userRepo: UsersRepository) {}

  async execute(
    query: GetAccountPlans,
  ): Promise<NotificationResult<AccountPlansViewDto[]>> {
    ///TODO query repos
    const plans = await this.userRepo.getAccountPlans();
    const mapperToView = plans.map(
      (i) =>
        new AccountPlansViewDto(i.id, i.price, i.type, i.durationUnit, i.name),
    );
    return NotificationResult.Success(mapperToView);
  }
}
