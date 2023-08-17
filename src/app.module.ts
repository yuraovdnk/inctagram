import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvConfig } from './core/common/config/env.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './core/adapters/database/prisma/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
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
// export class AppModule implements NestModule {
// configure(consumer: MiddlewareConsumer): any {
//   consumer.apply(AsyncStorageMiddleware).forRoutes('*');
// }
//}
