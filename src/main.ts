import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerConfig } from './core/adapters/swagger/swagger.setup';
import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import process from 'process';
import { useContainer } from 'class-validator';
import {
  ErrorExceptionFilter,
  HttpExceptionFilter,
} from './core/common/exception/exception.filter';
import { NotificationExtension } from './core/common/notification/notification-extension';
import { getEnvFile } from './core/common/config/env.config';

export const setupApp = (app: INestApplication) => {
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: ['Accept', 'Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const errorsForResponse: NotificationExtension[] = [];
        for (const e of errors) {
          const key = Object.keys(e.constraints)[0];
          errorsForResponse.push({
            message: e.constraints[key],
            key: e.property,
          });
        }

        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  app.useGlobalFilters(new ErrorExceptionFilter(), new HttpExceptionFilter());
  return app;
};

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = setupApp(app);
  app.setGlobalPrefix('back-api');
  SwaggerConfig.setup(app);

  console.log(process.env.NODE_ENV, 'nodeenv');
  console.log(`env from:${getEnvFile()}`);
  console.log(process.env.PORT, 'port');

  await app.listen(process.env.PORT || 3000);
  SwaggerConfig.writeSwaggerFile();
}
bootstrap();
