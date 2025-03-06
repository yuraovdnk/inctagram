import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AsyncLocalStorage } from 'node:async_hooks';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClientManager {
  constructor(
    private prismaService: PrismaService,
    private als: AsyncLocalStorage<any>,
  ) {}

  get getClient(): PrismaClient {
    return this.als.getStore()?.prisma ?? this.prismaService;
  }
}
