import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AsyncLocalStorage } from 'node:async_hooks';
import { ExtendedPrismaClient } from './extended-prisma';

@Injectable()
export class PrismaClientManager {
  constructor(
    private prismaService: PrismaService,
    private als: AsyncLocalStorage<any>,
  ) {}

  get getClient(): ExtendedPrismaClient {
    return this.als.getStore()?.prisma ?? this.prismaService;
  }
}
