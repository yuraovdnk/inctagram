import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaClientManager } from './prisma-client-manager';
import { PrismaTransactionScope } from './prisma-transaction-scope';
import { TransactionScope } from '../transaction-scope';

@Global()
@Module({
  exports: [
    PrismaService,
    PrismaClientManager,
    {
      provide: TransactionScope,
      useClass: PrismaTransactionScope,
    },
  ],
  providers: [
    PrismaService,
    PrismaClientManager,
    {
      provide: TransactionScope,
      useClass: PrismaTransactionScope,
    },
  ],
})
export class PrismaModule {
  constructor() {}
}
