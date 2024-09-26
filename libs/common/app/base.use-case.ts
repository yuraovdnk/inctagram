import { NotificationResult } from '../notification/notification-result';
import { EventBus } from '@nestjs/cqrs';
import { TransactionScope } from '../../adapters/db/transaction-scope';

export abstract class BaseUseCase<Message> {
  protected constructor(
    private eventBus: EventBus,
    private transactionScope: TransactionScope,
  ) {}

  protected abstract onExecute(message: Message);

  async execute(message: Message) {
    return this.executeWithTransaction(message);
  }

  async handle(event: Message) {
    await this.executeWithTransaction(event);
  }

  async executeWithTransaction(message: Message) {
    const notificationResult: NotificationResult =
      await this.transactionScope.run(() => this.onExecute(message));

    if (notificationResult?.events) {
      notificationResult.events.forEach((event) => {
        this.eventBus.publish(event);
      });
    }

    return notificationResult.toViewResponse();
  }
}
