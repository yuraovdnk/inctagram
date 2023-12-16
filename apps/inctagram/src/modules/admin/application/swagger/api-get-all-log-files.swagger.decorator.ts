import { applyDecorators, Type } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../../../common/decorators/swagger/nofication-result.swagger';

export const ApiGetAllLogFiles = <T extends Type<any>>(
  notificationDataType?: T,
) =>
  applyDecorators(
    ApiOperation({ summary: 'Get all log files' }),
    ApiNotificationResult(notificationDataType),
  );
