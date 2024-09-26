import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entity/user.entity';
import { User } from '@prisma/client';
import { UserMapper } from '../user.mapper';
import { ExternalAccountEntity } from '../../domain/entity/external-account.entity';
import { PrismaService } from '../../../../../../../libs/adapters/db/prisma/prisma.service';
import { PrismaClientManager } from '../../../../../../../libs/adapters/db/prisma/prisma-client-manager';

@Injectable()
export class UsersRepository {
  constructor(
    private prismaService: PrismaService,
    private prismaClientManager: PrismaClientManager,
  ) {}

  async create(entity: UserEntity): Promise<string> {
    const userModel = UserMapper.toModel(entity);
    const user = await this.prismaClientManager.getClient.user.create({
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
      include: {
        profile: true,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async findByConfirmedEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prismaClientManager.getClient.user.findUnique({
      where: {
        email,
        isEmailConfirmed: true,
      },
      include: {
        profile: true,
      },
    });

    return user ? UserMapper.toEntity(user) : null;
  }

  async deleteUserUnconfirmedEmail(email: string, username: string) {
    const deleteUser = async (userId: string) => {
      await this.prismaClientManager.getClient.emailConfirmationCode.delete({
        where: { userId },
      });
      await this.prismaClientManager.getClient.user.delete({
        where: {
          id: userId,
          isEmailConfirmed: false,
        },
      });
    };

    const userByEmail =
      await this.prismaClientManager.getClient.user.findUnique({
        where: {
          email,
          isEmailConfirmed: false,
        },
      });
    if (userByEmail) await deleteUser(userByEmail.id);
    const userByUserName =
      await this.prismaClientManager.getClient.user.findUnique({
        where: {
          username,
          isEmailConfirmed: false,
        },
      });
    if (userByUserName) await deleteUser(userByUserName.id);
  }

  async findByUsername(username: string) {
    return this.prismaClientManager.getClient.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findByUsernameConfirmedEmail(username: string) {
    return this.prismaClientManager.getClient.user.findUnique({
      where: {
        username,
        isEmailConfirmed: true,
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
      include: {
        profile: true,
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

  async upsertUserProfile(user: UserEntity) {
    const profileData = {
      aboutMe: user.profile.aboutMe ?? null,
      city: user.profile.city ?? null,
      country: user.profile.country,
      dateOfBirth: user.profile.dateOfBirth ?? null,
      lastName: user.profile.lastName,
      firstName: user.profile.firstName,
    };

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        username: user.username,
        profile: {
          upsert: {
            create: profileData,
            update: profileData,
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async getUserProfile(id: string): Promise<UserEntity> {
    const profile = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
    return profile ? UserMapper.toEntity(profile) : null;
  }

  async saveUserAvatar(userId: string, fileName: string) {
    return this.prismaService.userProfile.update({
      where: { userId },
      data: {
        avatar: fileName,
      },
    });
  }

  async deleteUserAvatar(user: UserEntity) {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      include: {
        profile: true,
      },
      data: {
        profile: {
          update: {
            avatar: null,
          },
        },
      },
    });
  }

  async getCountUsers() {
    return this.prismaService.user.count({
      where: {
        isEmailConfirmed: true,
      },
    });
  }
}
