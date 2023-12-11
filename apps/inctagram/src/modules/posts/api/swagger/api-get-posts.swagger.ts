import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiNotificationResultPaginated } from '../../../../../../../libs/common/swagger-api/api-notification-result-paginated.swagger.decorator';
import { GetPostsFindOptions } from '../dto/get-posts-find.options';

export const ApiGetPosts = (data: any) =>
  applyDecorators(
    ApiOperation({ summary: 'Get all user`s posts' }),
    ApiNotificationResultPaginated(data),
    ApiQuery({ type: GetPostsFindOptions }),
  );
