import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
} from '@nestjs/swagger';
import { NotificationResult } from '../../../../../core/common/notification/notification-result';
import { UserInfoViewDto } from '../response/user-info.view.dto';

class withDataType extends NotificationResult<UserInfoViewDto> {
  @ApiProperty({
    type: UserInfoViewDto,
  })
  data: UserInfoViewDto;
}

export const MeRequiredSwaggerDecorator = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOkResponse({
      type: withDataType,
    }),
    ApiOperation({ summary: 'get user information' }),
  );
