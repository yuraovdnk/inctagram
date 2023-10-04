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
    ApiNotificationResult(),
    ApiBody({ type: NewPasswordDto }),
  );
