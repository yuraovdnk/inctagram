import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../request/login.dto';

export const LoginRequired = () =>
  applyDecorators(
    ApiUnauthorizedResponse({
      description: 'If the password or login is wrong',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
    }),
    ApiOkResponse({
      description:
        'Returns JWT accessToken in body and JWT refreshToken in cookie (http-only, secure)',
      schema: {
        properties: { accessToken: { type: 'string' } },
      },
    }),
    ApiBody({ type: LoginDto }),
    ApiOperation({ summary: 'login' }),
  );
