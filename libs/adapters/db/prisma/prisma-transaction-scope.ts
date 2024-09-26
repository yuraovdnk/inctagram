import { TransactionScope } from '../transaction-scope';
import { PrismaService } from './prisma.service';
import { AsyncLocalStorage } from 'node:async_hooks';
import { NotificationResult } from '../../../common/notification/notification-result';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaTransactionScope implements TransactionScope {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly transactionContext: AsyncLocalStorage<any>,
  ) {}

  async run(fn: () => Promise<NotificationResult>): Promise<any> {
    let notificationResult: NotificationResult;

    try {
      await this.prismaService.$transaction(async (prisma) => {
        console.log('transaction started!!!');
        await this.transactionContext.run(
          {
            prisma,
          },
          async () => {
            notificationResult = await fn();
          },
        );

        if (notificationResult.hasError()) {
          throw new Error();
        }
      });
    } catch (e) {
      console.log(e);
      console.log('transaction failed');
    } finally {
      console.log('transaction ended');
    }

    return notificationResult;
  }
}
