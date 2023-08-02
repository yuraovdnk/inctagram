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
      data: {
        id: entity.id,
        email: entity.email,
        passwordHash: entity.passwordHash,
        username: entity.username,
      },
    });
    return user.id;
  }

  async updatePassword(entity: UserEntity): Promise<User | null> {
    try {
      return await this.prismaService.user.update({
        where: { id: entity.id },
        data: {
          passwordHash: entity.passwordHash,
        },
      });
    } catch (e) {
      console.error(e);
    }
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

  async update(user: UserEntity) {
    return this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailConfirmed: user.isConfirmedEmail,
      },
    });
  }
  async findById(id: string): Promise<UserEntity | null> {
    const user: User = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
    return user ? UserMapper.toEntity(user) : null;
  }
}
