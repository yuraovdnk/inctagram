import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvConfig } from '../../../libs/common/config/env.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from '../../../libs/adapters/db/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import process from 'process';
import { LoggerMiddleware } from '../../../libs/logger/logger.middleware';
import { AdminModule } from './modules/admin/admin.module';
import { PostsModule } from './modules/posts/posts.module';
import { ServicesModule } from './clients/services.module';
import { AlsModule } from './als.module';

@Module({
  imports: [
    AlsModule,
    ServicesModule,
    ConfigModule.forRoot({
      load: [getEnvConfig],
      envFilePath: ['.env', '.env.test'],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    PrismaModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    AuthModule,
    AdminModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
