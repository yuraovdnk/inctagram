import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/adapters/database/prisma/prisma.service';
import { EmailConfirmationEntity } from '../../domain/entity/email-confirmation.entity';
import { PasswordRecoveryEntity } from '../../domain/entity/password-recovery.entity';
import { EmailConfirmationCodeMapper } from '../mappers/email-confirmation-code.mapper';
import { AuthSessionMapper } from '../mappers/auth-session.mapper';
import { AuthSessionEntity } from '../../domain/entity/auth-session.entity';
import {
  AuthSession,
  PasswordRecoveryCode,
  PrismaClient,
} from '@prisma/client';
import { PasswordRecoveryMapper } from '../password-recovery.mapper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as runtime from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createEmailConfirmCode(
    entity: EmailConfirmationEntity,
    prisma?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ) {
    const prismaService = prisma ?? this.prismaService;

    const res = await prismaService.emailConfirmationCode.upsert({
      where: {
        userId: entity.userId,
      },
      update: {
        code: entity.code,
        expireAt: entity.expireAt,
      },
      create: {
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

  async findByConfirmCode(
    code: string,
  ): Promise<EmailConfirmationEntity | null> {
    const confirmCode =
      await this.prismaService.emailConfirmationCode.findFirst({
        where: { code },
        include: {
          user: true,
        },
      });

    return confirmCode
      ? EmailConfirmationCodeMapper.toEntity(confirmCode)
      : null;
  }

  async findAuthSessionByDeviceId(
    deviceId: string,
  ): Promise<AuthSessionEntity | null> {
    let session: AuthSession = await this.cacheManager.get<AuthSession>(
      deviceId,
    );

    if (!session) {
      session = await this.prismaService.authSession.findFirst({
        where: {
          deviceId,
        },
      });

      if (session) {
        await this.cacheManager.set(deviceId, session);
      }
    }

    return session ? AuthSessionMapper.toEntity(session) : null;
  }

  async createAuthSession(authSession: AuthSessionEntity): Promise<void> {
    const model = AuthSessionMapper.toModel(authSession);
    await this.prismaService.authSession.create({
      data: model,
    });
  }

  async refreshAuthSession(
    deviceId: string,
    authEntity: AuthSessionEntity,
  ): Promise<void> {
    const model = AuthSessionMapper.toModel(authEntity);
    await this.prismaService.authSession.update({
      where: {
        deviceId: model.deviceId,
      },
      data: model,
    });
    await this.cacheManager.set(model.deviceId, model);
  }

  async killAuthSession(deviceId: string): Promise<void> {
    await this.prismaService.authSession.delete({
      where: {
        deviceId,
      },
    });
    await this.cacheManager.del(deviceId);
  }
}
