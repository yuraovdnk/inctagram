import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { EmailConfirmationEntity } from '../../domain/entity/email-confirmation.entity';
import { PasswordRecoveryEntity } from '../../domain/entity/password-recovery.entity';
import { PasswordRecoveryCode } from '@prisma/client';
import { PasswordRecoveryMapper } from '../password-recovery.mapper';

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
  async createPasswordRecoveryCode(entity: PasswordRecoveryEntity) {
    return this.prismaService.passwordRecoveryCode.create({
      data: {
        code: entity.code,
        userId: entity.userId,
        expireAt: entity.expireAt,
      },
    });
  }

  async findPasswordRecovery(
    code: string,
  ): Promise<PasswordRecoveryEntity | null> {
    const passwordRecoveryCode: PasswordRecoveryCode =
      await this.prismaService.passwordRecoveryCode.findFirst({
        where: { code, expireAt: { gt: new Date() } },
      });
    return passwordRecoveryCode
      ? PasswordRecoveryMapper.toEntity(passwordRecoveryCode)
      : null;
  }
}
