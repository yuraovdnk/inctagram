import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../auth/application/dto/swagger/nofication-result.swagger';

export const ApiDeleteProfileAvatar = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete user avatar' }),
    ApiNotificationResult(),
  );
