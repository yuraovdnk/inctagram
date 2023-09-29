import { NestFactory } from '@nestjs/core';
import { FilesMicroserviceModule } from './files-microservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import process from 'process';
import { ExceptionFilter } from './common/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FilesMicroserviceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: +process.env.FILE_SERVICE_PORT,
      },
    },
  );
  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();
}
bootstrap();
