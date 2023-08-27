import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { NotificationResult } from '../../../../../core/common/notification/notification-result';

export const AuthByExternalAccountResponseSwagger = () =>
  applyDecorators(
    ApiOkResponse({
      type: NotificationResult,
      description:
        'Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)',
    }),

    ApiOperation({ summary: 'auth via oauth' }),
  );
