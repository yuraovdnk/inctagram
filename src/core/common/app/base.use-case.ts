import { PrismaService } from '../../adapters/database/prisma/prisma.service';
import { NotificationResult } from '../notification/notification-result';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export abstract class BaseUseCase<Message> {
  protected prismaClient: Omit<PrismaClient, runtime.ITXClientDenyList>;
  protected constructor(protected readonly prismaService: PrismaService) {}

  protected abstract onExecute(message: Message);

  async execute(message: Message) {
    return this.executeWithTransaction(message); //1
  }

  async handle(event: Message) {
    await this.executeWithTransaction(event);
  }

  async executeWithTransaction(message: Message) {
    let domainNotification: NotificationResult;

    try {
      await this.prismaService.$transaction(async (prisma) => {
        this.prismaClient = prisma;
        console.log('transaction started');
        domainNotification = await this.onExecute(message);
        if (domainNotification.hasError()) {
          throw new Error();
        }
      });
    } catch (e) {
      console.log(e);
      console.log('transaction failed');
    } finally {
      console.log('transaction ended');
    }
    return domainNotification;
  }
}
