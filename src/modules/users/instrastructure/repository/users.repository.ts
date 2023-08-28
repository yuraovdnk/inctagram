import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { UserEntity } from '../../domain/entity/user.entity';
import { User } from '@prisma/client';
import { UserMapper } from '../user.mapper';
import { ExternalAccountEntity } from '../../domain/entity/external-account.entity';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(entity: UserEntity): Promise<string> {
    console.log('111111111111111111');
    const userModel = UserMapper.toModel(entity);

    const user = await this.prismaService.user.create({
      data: userModel,
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
      console.log(e);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
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

  async saveExternalAccount(externalAccount: ExternalAccountEntity) {
    await this.prismaService.externalAccount.create({
      data: {
        email: externalAccount.email,
        createdAt: externalAccount.createdAt,
        provider: externalAccount.provider,
        providerId: externalAccount.providerId,
        userId: externalAccount.userId,
      },
    });
  }

  async findUserByProviderId(providerId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        externalAccounts: {
          some: {
            providerId,
          },
        },
      },
      include: {
        externalAccounts: true,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }
}
