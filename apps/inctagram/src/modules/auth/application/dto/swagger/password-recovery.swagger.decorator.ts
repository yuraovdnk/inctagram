import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PasswordRecoveryDto } from '../request/password-recovery.dto';
import { ApiNotificationResult } from './nofication-result.swagger';

export const ApiPasswordRecovery = () =>
  applyDecorators(
    ApiOperation({ summary: 'Password recovery' }),
    ApiNotificationResult(),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
    ApiBody({ type: PasswordRecoveryDto }),
  );
