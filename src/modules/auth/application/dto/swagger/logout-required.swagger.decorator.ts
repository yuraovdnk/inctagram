import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const LogoutRequired = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
    ApiNoContentResponse(),

    ApiOperation({
      summary:
        'In cookie client must send correct refreshToken that will be revoked',
    }),
  );
