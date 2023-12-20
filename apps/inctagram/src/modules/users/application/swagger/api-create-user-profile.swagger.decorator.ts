import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../../../common/decorators/swagger/nofication-result.swagger';
import { UserProfileDto } from '../dto/request/user-profile.dto';

export const ApiCreateUserProfile = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create user profile' }),
    ApiNotificationResult(),
    ApiBody({ type: UserProfileDto }),
  );
