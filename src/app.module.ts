import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvConfig } from './core/common/config/env.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './core/adapters/database/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: [getEnvConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
