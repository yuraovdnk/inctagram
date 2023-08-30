import { applyDecorators, Type } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ApiNotificationResult } from './nofication-result.swagger';

export const ApiGetUserInfo = <T extends Type<any>>(notificationData: T) =>
  applyDecorators(
    ApiBearerAuth(),
    ApiNotificationResult(notificationData),
    ApiOperation({ summary: 'get user information' }),
  );
