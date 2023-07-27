import { PrismaService } from '../../src/core/adapters/database/prisma/prisma.service';
import { SignUpDto } from '../../src/modules/auth/application/dto/request/signUp.dto';
import * as crypto from 'crypto';
import { PasswordRecoveryCode, User } from '@prisma/client';

export class DbTestHelper {
  private prisma: PrismaService;
  constructor() {
    this.prisma = new PrismaService();
  }
  async clearDb() {
    const tableNames = await this.prisma.$queryRaw<
      Array<{ tablename: string }>
    >`SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'`;
    const tables = tableNames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ');

    try {
      const res = await this.prisma.$executeRawUnsafe(
        `TRUNCATE TABLE ${tables} CASCADE;`,
      );
    } catch (error) {
      console.error({ error });
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async creatUser(dto: SignUpDto): Promise<User | null> {
    const { email, username, password, passwordConfirm } = dto;
    const id = crypto.webcrypto.randomUUID();
    const query = `
    INSERT INTO "User" (id, username, email, "createdAt", "passwordHash")
    VALUES ('${id}', '${username}', '${email}', NOW(), '${'passwordHash'}');
  `;

    try {
      const result = await this.prisma.$executeRawUnsafe(query);
      if (result != 1) {
        return null;
      }
      return this.prisma.$queryRawUnsafe(
        'SELECT * FROM "User" WHERE id = $1',
        id,
      );
    } catch (error) {
      console.error('Error executing SQL query:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async getPasswordRecoveryCode(userId): Promise<PasswordRecoveryCode | null> {
    try {
      const res = await this.prisma.$queryRawUnsafe(
        'SELECT * FROM "password_recovery_codes" WHERE "userId" = $1',
        userId,
      );
      return res[0].code;
    } catch (error) {
      console.error('Error executing SQL query:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }
}
