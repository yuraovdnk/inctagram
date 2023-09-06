import { applyDecorators, Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from './nofication-result.swagger';

export const RefreshTokenRequired = <T extends Type<any>>(
  notificationData?: T,
) =>
  applyDecorators(
    ApiNotificationResult(notificationData),
    ApiOperation({
      summary:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)',
    }),
  );
