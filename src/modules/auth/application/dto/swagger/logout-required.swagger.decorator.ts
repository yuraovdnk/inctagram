import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from './nofication-result.swagger';

export const LogoutRequired = () =>
  applyDecorators(
    ApiNotificationResult(),
    ApiOperation({
      summary:
        'In cookie client must send correct refreshToken that will be revoked',
    }),
  );
