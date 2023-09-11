import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './core/adapters/swagger/swagger.setup';
import process from 'process';
import { setupApp } from './setup-app';

async function bootstrap() {
  let app = await NestFactory.create(AppModule);
  app = setupApp(app);
  app.setGlobalPrefix('back-api');
  SwaggerConfig.setup(app);
  await app.listen(process.env.PORT || 3000);
  SwaggerConfig.writeSwaggerFile();
}
bootstrap();
