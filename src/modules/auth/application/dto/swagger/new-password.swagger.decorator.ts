import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { NewPasswordDto } from '../request/new-password.dto';
import { ApiNotificationResult } from './nofication-result.swagger';

export const ApiNewPassword = () =>
  applyDecorators(
    ApiOperation({ summary: 'Confirm Password recovery' }),
    ApiTooManyRequestsResponse({
      description: 'More than 5 attempts from one IP-address during 10 seconds',
    }),
    ApiNotificationResult(),
    ApiBody({ type: NewPasswordDto }),
  );
