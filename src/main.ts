import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { swaggerSetup } from './core/adapters/swagger/swagger.setup';

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
  await app.listen(3000);
}
bootstrap();
