import { applyDecorators, Type } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ApiNotificationResult } from '../../../../../../common/decorators/swagger/nofication-result.swagger';

export const ApiGetUserInfo = <T extends Type<any>>(notificationData: T) =>
  applyDecorators(
    ApiBearerAuth('accessToken'),
    ApiNotificationResult(notificationData),
    ApiOperation({ summary: 'Get information about current user' }),
  );
