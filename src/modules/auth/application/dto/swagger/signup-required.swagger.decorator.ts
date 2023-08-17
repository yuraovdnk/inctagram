import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from '../request/sign-up.dto';
import { NotificationResult } from '../../../../../core/common/notification/notification-result';

export const SignupRequired = () =>
  applyDecorators(
    ApiOkResponse({
      type: NotificationResult,
    }),
    ApiBody({ type: SignUpDto }),
    ApiOperation({ summary: 'signup' }),
  );
