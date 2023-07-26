import { PrismaService } from '../../adapters/database/prisma/prisma.service';

export abstract class BaseUseCase<Message> {
  constructor(protected readonly prismaService: PrismaService) {}

  protected abstract onExecute(message: Message);

  async execute(message: Message) {
    await this.executeWithTransaction(message);
  }

  async handle(event: Message) {
    await this.executeWithTransaction(event);
  }

  async executeWithTransaction(message: Message) {
    await this.prismaService.$transaction(async () => {
      console.log('transaction started');
      try {
        this.onExecute(message);
      } catch (e) {
        console.log('transaction failed');
        throw new Error(e);
      }
    });
  }
}
