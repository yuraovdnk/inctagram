import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let stack = undefined;
    if (
      process.env.NODE_ENV === 'test' ||
      process.env.NODE_ENV === 'development'
    ) {
      stack = exception.stack;
    }
    const test: any = exception.getResponse();

    let responseBody: NotificationResult;

    switch (exception.getStatus()) {
      case 400:
        responseBody = new BadResult(test.message);
        if (isArray(test.message)) {
          responseBody.extensions = test.message;
        }
        break;
      case 401:
        responseBody = new UnAuthorizedResult(test.message);
        break;
      case 403:
        responseBody = new ForbiddenResult(test.message);
        break;
      case 404:
        responseBody = new NotFoundResult(test.message);
        break;
      default:
        responseBody = new NotFoundResult('some error occurred');
    }

    response.status(200).json({ ...responseBody, stack });
  }
}
