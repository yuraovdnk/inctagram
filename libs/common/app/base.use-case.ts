import { PrismaService } from '../../adapters/db/prisma/prisma.service';
import { NotificationResult } from '../notification/notification-result';
import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';
import { EventBus } from '@nestjs/cqrs';

export abstract class BaseUseCase<Message> {
  protected prismaClient: Omit<PrismaClient, runtime.ITXClientDenyList> | any;

  protected constructor(
    protected readonly prismaService: PrismaService,
    protected eventBus: EventBus,
  ) {}

  protected abstract onExecute(message: Message);

  async execute(message: Message) {
    return this.executeWithTransaction(message);
  }

  async handle(event: Message) {
    await this.executeWithTransaction(event);
  }

  async executeWithTransaction(message: Message) {
    let notificationResult: NotificationResult;

    try {
      await this.prismaService.$transaction(async (prisma) => {
        this.prismaClient = prisma;
        console.log('transaction started!!!');
        notificationResult = await this.onExecute(message);
        if (notificationResult.hasError()) {
          throw new Error();
        }
        notificationResult.events.forEach((event) => {
          this.eventBus.publish(event);
        });
      });
    } catch (e) {
      console.log(e);
      console.log('transaction failed');
    } finally {
      console.log('transaction ended');
    }
    return notificationResult.toViewResponse();
  }
}
