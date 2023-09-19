import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ResendConfirmationEmailDto } from '../request/resend-confirmation-email.dto';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';

export const RegistrationEmailResendingRequiredSwaggerDecorator = () =>
  applyDecorators(
    ApiOkResponse({
      type: NotificationResult,
    }),
    ApiBody({ type: ResendConfirmationEmailDto }),
    ApiOperation({
      summary: 'Resend confirmation registration Email if user exists',
    }),
  );
