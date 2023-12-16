import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { LoginDto } from '../request/login.dto';
import { ApiNotificationResult } from '../../../../../../common/decorators/swagger/nofication-result.swagger';

export const LoginRequired = <T extends Type<any>>(notificationData?: T) =>
  applyDecorators(
    ApiNotificationResult(
      notificationData,
      'Returns resultNotification in body (JWT accessToken in data) and JWT refreshToken in cookie (http-only, secure)',
    ),
    ApiBody({ type: LoginDto }),
    ApiOperation({
      summary: 'Try login user to the system',
    }),
  );
