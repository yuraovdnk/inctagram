import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../auth/application/dto/swagger/nofication-result.swagger';
import { UserProfileDto } from '../dto/request/user-profile.dto';

export const ApiUpdateUserProfile = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update user profile' }),
    ApiNotificationResult(),
    ApiBody({ type: UserProfileDto }),
  );
