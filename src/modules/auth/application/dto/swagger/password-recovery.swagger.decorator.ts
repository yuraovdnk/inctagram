import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PasswordRecoveryDto } from '../request/password-recovery.dto';

export const PasswordRecoveryRequired = () =>
  applyDecorators(
    ApiOperation({ summary: 'Password recovery' }),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'If the inputModel has invalid email',
    }),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
    ApiBody({ type: PasswordRecoveryDto }),
  );
