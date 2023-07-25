import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { UserEntity } from '../../domain/entity/user.entity';

@Injectable()
export class UsersRepository {
  constructor(private prismaService: PrismaService) {}
  async create(entity: UserEntity): Promise<string> {
    const user = await this.prismaService.user.create({
      data: entity,
    });
    return user.id;
  }

  findByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
  findByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }
}
