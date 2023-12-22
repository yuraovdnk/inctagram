import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../../../common/decorators/swagger/nofication-result.swagger';

export const ApiGetPostById = (data: any) =>
  applyDecorators(
    ApiOperation({ summary: 'Get post' }),
    ApiNotificationResult(data),
  );
