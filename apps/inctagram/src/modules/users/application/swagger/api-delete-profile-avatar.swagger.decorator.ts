import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../../../common/decorators/swagger/nofication-result.swagger';

export const ApiDeleteProfileAvatar = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete user avatar' }),
    ApiNotificationResult(),
  );
