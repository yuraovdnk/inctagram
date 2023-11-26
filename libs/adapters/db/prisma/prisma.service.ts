import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ExtendedPrismaClient } from '../../../../prisma/extended-prisma';

@Injectable()
export class PrismaService
  extends ExtendedPrismaClient
  implements OnModuleInit
{
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
