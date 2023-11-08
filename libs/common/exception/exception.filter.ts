import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import {
  BadResult,
  ForbiddenResult,
  InternalServerError,
  NotFoundResult,
  NotificationResult,
  UnAuthorizedResult,
} from '../notification/notification-result';
import { isArray } from 'class-validator';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    new Logger(ErrorExceptionFilter.name).error(exception, exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let stack = undefined;
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      stack = exception.stack;
    }
    const res = new InternalServerError('some error occurred');
    response.status(200).json({ ...res, stack });
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    new Logger(HttpExceptionFilter.name).error(exception, exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let stack = undefined;
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      stack = exception.stack;
    }
    const errorResponse: any = exception.getResponse();

    let responseBody: NotificationResult;

    switch (exception.getStatus()) {
      case 400:
        responseBody = new BadResult(errorResponse.message);
        if (isArray(errorResponse.message)) {
          responseBody.extensions = errorResponse.message;
        }
        break;
      case 401:
        responseBody = new UnAuthorizedResult(errorResponse.message);
        break;
      case 403:
        responseBody = new ForbiddenResult(errorResponse.message);
        break;
      case 404:
        responseBody = new NotFoundResult(errorResponse.message);
        break;
      default:
        responseBody = new InternalServerError('Oops, some error occurred');
    }

    response.status(200).json({ ...responseBody, stack });
  }
}
