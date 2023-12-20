import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../../../common/decorators/swagger/nofication-result.swagger';

export const ApiDeletePost = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete post' }),
    ApiNotificationResult(),
    ApiBearerAuth(),
  );
