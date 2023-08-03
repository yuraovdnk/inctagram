import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { SwaggerConfig } from './core/adapters/swagger/swagger.setup';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  SwaggerConfig.setup(app);
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
  await app.listen(process.env.PORT || 3000);
  SwaggerConfig.writeSwaggerFile();
}
bootstrap();
