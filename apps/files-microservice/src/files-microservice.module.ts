import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getEnvConfig } from 'libs/common/config/env.config';
import { ImagesModule } from './modules/images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getEnvConfig],
      envFilePath: ['.env', '.env.test'],
      isGlobal: true,
    }),

    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class FilesMicroserviceModule {}
