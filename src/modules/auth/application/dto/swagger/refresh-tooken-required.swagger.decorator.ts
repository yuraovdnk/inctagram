import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const RefreshTokenRequired = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),

    ApiOkResponse({
      description:
        'Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)',
      schema: {
        properties: { accessToken: { type: 'string' } },
      },
    }),

    ApiOperation({
      summary:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)',
    }),
  );
