import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResultPaginated } from '../../../../../../../libs/common/swagger-api/api-notification-result-paginated.swagger.decorator';

export const ApiGetPosts = (data: any) =>
  applyDecorators(
    ApiOperation({ summary: 'Get all user`s posts' }),
    ApiNotificationResultPaginated(data),
  );
