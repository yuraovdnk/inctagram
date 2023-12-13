import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';

export const ApiTerminateAuthSession = () =>
  applyDecorators(
    ApiOkResponse({
      type: NotificationResult,
    }),
    ApiOperation({ summary: 'terminate auth session' }),
  );
