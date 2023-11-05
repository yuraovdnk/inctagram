import { NestFactory } from '@nestjs/core';
import { FilesMicroserviceModule } from './files-microservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import process from 'process';
import { ExceptionFilter } from './common/rpc-exception.filter';
import { WinstonModule } from 'nest-winston';
import { consoleTransport } from '../../../libs/logger/winston-logger.config';
import { MongoDB } from 'winston-mongodb';
import { format } from 'winston';

const dbTransport = new MongoDB({
  db: process.env.MONGODB_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  collection: 'logs-files-ms',
  level: process.env.LOGS_DB_LEVEL ?? 'warn',
  format: format.combine(
    format.timestamp(),
    format.metadata({
      fillWith: ['context'],
    }),
  ),
});
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FilesMicroserviceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: +process.env.FILE_SERVICE_PORT,
      },
      logger: WinstonModule.createLogger({
        transports: [dbTransport, consoleTransport],
      }),
    },
  );
  app.useGlobalFilters(new ExceptionFilter());
  await app.listen();
}
bootstrap();
