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
        const errorsForResponse = [];
        for (const e of errors) {
          const key = Object.keys(e.constraints)[0];
          errorsForResponse.push({
            message: e.constraints[key],
            field: e.property,
          });
        }
        throw new BadRequestException(errorsForResponse);
      },
    }),
  );
  return app;
};

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = setupApp(app);
  SwaggerConfig.setup(app);

  await app.listen(process.env.PORT || 3000);
  SwaggerConfig.writeSwaggerFile();
}
bootstrap();
