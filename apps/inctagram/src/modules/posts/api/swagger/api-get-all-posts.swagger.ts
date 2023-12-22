import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiNotificationResultPaginated } from '../../../../../../../libs/common/swagger-api/api-notification-result-paginated.swagger.decorator';
import { GetUsersPostsFindOptions } from '../dto/get-users-posts.dto';

export const ApiGetPosts = (data: any) =>
  applyDecorators(
    ApiOperation({ summary: 'Get all public posts' }),
    ApiNotificationResultPaginated(data),
    ApiQuery({ type: GetUsersPostsFindOptions }),
  );
