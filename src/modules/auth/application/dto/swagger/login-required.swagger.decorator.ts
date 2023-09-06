import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from '../request/login.dto';
import { ApiNotificationResult } from './nofication-result.swagger';

export const LoginRequired = <T extends Type<any>>(notificationData?: T) =>
  applyDecorators(
    ApiNotificationResult(notificationData),
    ApiBody({ type: LoginDto }),
    ApiOperation({ summary: 'login' }),
  );
