import { RpcException } from '@nestjs/microservices';
import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { of } from 'rxjs';
import { InternalServerError } from '../../../../libs/common/notification/notification-result';

@Catch()
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost) {
    console.log(exception, 'exception from files ms');
    const errorResponse = new InternalServerError('some error occurred');
    return of(errorResponse);
  }
}
