import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PrismaService } from './core/adapters/database/prisma/prisma.service';

export type StoreType = { prismaService: PrismaService };

@Injectable()
export class AsyncStorageMiddleware implements NestMiddleware {
  constructor(
    private asyncLocalStorage: AsyncLocalStorage<any>, //private prismaService: PrismaService,
  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.asyncLocalStorage.run(
      {
        //userId: 1,
        //prismaService: this.prismaService,
      },
      () => next(),
    );
  }
}
