import { applyDecorators, Type } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../auth/application/dto/swagger/nofication-result.swagger';
import { UserProfileDto } from '../dto/request/user-profile.dto';

export const ApiGetUserProfile = <T extends Type<any>>(
  notificationDataType: T,
) =>
  applyDecorators(
    ApiOperation({ summary: 'Get user profile' }),
    ApiNotificationResult(notificationDataType),
    ApiBody({ type: UserProfileDto }),
  );
