import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create() {}
  delete() {}

  update() {}

  getById() {}

  getAll() {
    return this.prismaService.user.findMany();
  }
}
