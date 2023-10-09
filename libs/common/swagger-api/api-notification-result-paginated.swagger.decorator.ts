import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { NotificationResult } from '../notification/notification-result';
import { PageDto } from '../dtos/pagination.dto';

export const ApiNotificationResultPaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(NotificationResult, PageDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(NotificationResult) },
          {
            properties: {
              data: {
                type: 'object',
                $ref: getSchemaPath(PageDto),
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
