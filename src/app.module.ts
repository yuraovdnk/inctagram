import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvConfig } from './core/common/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getEnvConfig],
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
