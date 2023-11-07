import { RpcException } from '@nestjs/microservices';
import {
  ArgumentsHost,
  Catch,
  Logger,
  RpcExceptionFilter,
} from '@nestjs/common';
import { of } from 'rxjs';
import { InternalServerError } from '../../../../libs/common/notification/notification-result';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(ExceptionFilter.name);
  catch(exception: RpcException, host: ArgumentsHost) {
    this.logger.error(exception, exception.stack);
    const errorResponse = new InternalServerError('some error occurred');
    return of(errorResponse);
  }
}
