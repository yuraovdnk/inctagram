import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { swaggerSetup } from './core/adapters/swagger/swagger.setup';
import { ValidationPipe } from '@nestjs/common';
import { mapValidationErrors } from './core/common/exception/validator-errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  swaggerSetup(app);
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
      exceptionFactory: mapValidationErrors,
    }),
  );
  await app.listen(3000);
}
bootstrap();
