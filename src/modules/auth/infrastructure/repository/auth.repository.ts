import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { EmailConfirmationEntity } from '../../domain/entity/email-confirmation.entity';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEmailConfirmCode(
    prisma: PrismaService,
    entity: EmailConfirmationEntity,
  ) {
    const res = await prisma.emailConfirmationCode.create({
      data: {
        code: entity.code,
        userId: entity.userId,
        expireAt: entity.expireAt,
      },
    });

    return res;
  }
}
