import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { EmailConfirmationEntity } from '../../domain/entity/email-confirmation.entity';
import { PasswordRecoveryEntity } from '../../domain/entity/password-recovery.entity';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEmailConfirmCode(entity: EmailConfirmationEntity) {
    const res = await this.prismaService.emailConfirmationCode.create({
      data: {
        code: entity.code,
        userId: entity.userId,
        expireAt: entity.expireAt,
      },
    });
    return res;
  }
  async createPasswordRecoveryCode(entity: PasswordRecoveryEntity) {
    const res = await this.prismaService.passwordRecoveryCode.create({
      data: {
        code: entity.code,
        userId: entity.userId,
        expireAt: entity.expireAt,
      },
    });
    console.log('[AuthRepository]: createPasswordRecoveryCode result', res);
    return res;
  }
}
