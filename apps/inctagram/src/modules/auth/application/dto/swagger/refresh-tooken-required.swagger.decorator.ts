import { applyDecorators, Type } from '@nestjs/common';
import { ApiCookieAuth, ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../../../../common/decorators/swagger/nofication-result.swagger';

export const RefreshTokenRequired = <T extends Type<any>>(
  notificationData?: T,
) =>
  applyDecorators(
    ApiNotificationResult(notificationData),
    ApiCookieAuth('refreshToken'),
    ApiOperation({
      summary:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)',
    }),
  );
