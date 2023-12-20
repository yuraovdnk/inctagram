import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ConfirmEmailDto } from '../request/confirm-email.dto';
import { ApiNotificationResult } from '../../../../../../common/decorators/swagger/nofication-result.swagger';

export const RegistrationConfirmationRequired = () =>
  applyDecorators(
    ApiNotificationResult(),
    ApiBody({ type: ConfirmEmailDto }),
    ApiOperation({
      summary:
        'To confirm registration, you need to send a code from the email',
    }),
  );
