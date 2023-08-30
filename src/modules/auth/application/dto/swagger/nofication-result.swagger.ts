import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { NotificationResult } from '../../../../../core/common/notification/notification-result';

export const ApiNotificationResult = <T extends Type<any>>(
  notificationData?: T,
) => {
  const options: ApiResponseOptions = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(NotificationResult) },
        {
          properties: {
            data: notificationData
              ? { $ref: getSchemaPath(notificationData), nullable: true }
              : { type: 'object', nullable: true, default: null },
          },
        },
      ],
    },
  };
  if (!notificationData) return ApiOkResponse(options);
  return applyDecorators(
    ApiExtraModels(notificationData),
    ApiOkResponse(options),
  );
};
