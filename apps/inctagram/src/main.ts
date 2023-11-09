import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import process from 'process';
import { setupApp } from './setup-app';
import { SwaggerConfig } from '../../../libs/adapters/api-doc/swagger.setup';
import { WinstonModule } from 'nest-winston';
import { winstonOptions } from '../../../libs/logger/winston-logger.config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  let app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonOptions),
  });
  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ limit: '20mb', extended: true }));
  app = setupApp(app);
  SwaggerConfig.setup(app);

  await app.listen(process.env.PORT || 3000, () => {
    console.log(`App listening at:${process.env.PORT || 3000} `);
  });

  SwaggerConfig.writeSwaggerFile();
}
bootstrap();
