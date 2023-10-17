import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../auth/application/dto/swagger/nofication-result.swagger';
import { EditPostDto } from '../dto/edit-post.dto';

export const ApiUpdatePost = () =>
  applyDecorators(
    ApiOperation({ summary: 'Edit post' }),
    ApiBody({ type: EditPostDto }),
    ApiNotificationResult(),
    ApiBearerAuth(),
  );
