import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { NotificationExtension } from '../../../libs/common/notification/notification-extension';
import {
  ErrorExceptionFilter,
  HttpExceptionFilter,
} from '../../../libs/common/exception/exception.filter';
import cookieParser from 'cookie-parser';

export const setupApp = (app: INestApplication) => {
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://inctagram.space',
      'https://inctagram-ruby.vercel.app',
    ],
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
