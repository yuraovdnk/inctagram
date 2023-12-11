import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { NotificationResult } from '../../../../../../../../libs/common/notification/notification-result';

export const ApiGetAuthSessions = <T extends Type<any>>(data: T) =>
  applyDecorators(
    ApiBearerAuth('accessToken'),
    ApiExtraModels(NotificationResult, data),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(NotificationResult) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(data) },
              },
            },
          },
        ],
      },
    }),
    ApiOperation({ summary: 'all auth session' }),
  );
