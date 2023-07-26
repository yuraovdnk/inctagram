import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { UserEntity } from '../../domain/entity/user.entity';
import { User } from '@prisma/client';
import { UserMapper } from '../user.mapper';
@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}
  async create(entity: UserEntity): Promise<string> {
    const user = await this.prismaService.user.create({
      data: entity,
    });
    return user.id;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
    return user ? UserMapper.toEntity(user) : null;
  }
  findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }
}
