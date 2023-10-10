import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
} from '@nestjs/swagger';
import { ApiNotificationResult } from '../../../auth/application/dto/swagger/nofication-result.swagger';
import { CreatePostDto } from '../../application/dto/create-post.dto';

export const ApiCreatePost = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create post' }),
    ApiBody({ type: CreatePostDto }),
    ApiNotificationResult(),
    ApiConsumes('multipart/form-data'),
    ApiBearerAuth(),
  );
