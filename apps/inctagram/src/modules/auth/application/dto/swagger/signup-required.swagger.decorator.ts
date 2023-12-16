import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { SignUpDto } from '../request/sign-up.dto';
import { ApiNotificationResult } from '../../../../../../common/decorators/swagger/nofication-result.swagger';

export const SignupRequired = <T extends Type<any>>(notificationDataType: T) =>
  applyDecorators(
    ApiNotificationResult(notificationDataType),
    ApiBody({ type: SignUpDto }),
    ApiOperation({
      summary:
        'Registration in the system. Email with confirmation code will be send to passed email address',
    }),
  );
