import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../../../../../../../libs/common/guards/jwt.guard';
import { CurrentUser } from '../../../../../../../libs/common/decorators/current-user.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpgradeAccountPlanCommand } from '../../application/use-cases/commands/upgrade-plan.command-handler';
import {
  GetAccountPlans,
  GetAccountPlansQueryHandler,
} from '../../application/use-cases/queries/get-account-plans.query-handler';
import { RMQRoute } from 'nestjs-rmq';

@Controller('account')
export class AccountController {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  //@UseGuards(JwtGuard)
  @Post('upgrade/:planId')
  async upgradePlan(
    //@CurrentUser() userId: string,
    @Param('planId', ParseUUIDPipe) planId: string,
  ) {
    //console.log(userId);
    const userIdTest = 'a88956d3-424b-4c8e-86e5-93c48dcf8712';
    return this.commandBus.execute(
      new UpgradeAccountPlanCommand(userIdTest, planId),
    );
  }

  @Get('plans')
  async getPlans() {
    const plans = await this.queryBus.execute<
      unknown,
      Awaited<ReturnType<GetAccountPlansQueryHandler['execute']>>
    >(new GetAccountPlans());

    return plans;
  }

  @RMQRoute('account.updated')
  async acc(data: string) {
    console.log(data, AccountController.name);
  }
}
