import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ConfirmEmailDto } from '../request/confirm-email.dto';

export const RegistrationConfirmationRequired = () =>
  applyDecorators(
    ApiNoContentResponse({
      description: 'Congratulations! Your email has been confirmed',
    }),
    ApiBadRequestResponse({
      description:
        'If the confirmation code is incorrect, expired or already been applied',
    }),
    ApiBody({ type: ConfirmEmailDto }),
    ApiOperation({ summary: 'confirm registration' }),
  );
