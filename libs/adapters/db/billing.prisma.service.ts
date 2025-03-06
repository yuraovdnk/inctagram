import { INestApplication, Injectable } from '@nestjs/common';

import { PrismaClient } from '@prisma/billing';
@Injectable()
export class BillingPrismaService extends PrismaClient {
  constructor() {
    super();
  }
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
