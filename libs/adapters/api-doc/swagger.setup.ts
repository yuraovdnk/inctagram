import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';
import process from 'process';
import { NotificationCodesEnumSwagger } from '../../common/notification/notification-codes.enum';

export class SwaggerConfig {
  static setup(app: INestApplication) {
    const config = new DocumentBuilder()
      .setTitle('Inctagram')
      .setDescription(
        `
## Коды ответов API:

\`\`\`json
{
  "OK": 0,
  "ERROR": 1,
  "BAD_REQUEST": 2,
  "UNAUTHORIZED": 3,
  "FORBIDDEN": 4,
  "NOT_FOUND": 5,
  "NOT_CONFIRMED": 6,
  "NOT_EXIST": 7,
  "CREATED": 8,
  "UPLOADED": 9
}
\`\`\`
`,
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT accessToken in headers',
          in: 'header',
        },
        'accessToken',
      )
      .addCookieAuth(
        'refreshToken',
        {
          type: 'apiKey',
          in: 'cookie',
        },
        'refreshToken',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/swagger', app, document);
  }
  static writeSwaggerFile() {
    const serverUrl = process.env.API_HOME_URL;

    if (process.env.NODE_ENV === 'development') {
      // write swagger ui files
      get(`${serverUrl}/swagger/swagger-ui-bundle.js`, function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      });

      get(`${serverUrl}/swagger/swagger-ui-init.js`, function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      });

      get(
        `${serverUrl}/swagger/swagger-ui-standalone-preset.js`,
        function (response) {
          response.pipe(
            createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
          );
        },
      );

      get(`${serverUrl}/swagger/swagger-ui.css`, function (response) {
        response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      });
      new Logger(SwaggerConfig.name).log(
        `Openapi documentation is available at ${serverUrl}/swagger`,
      );
    }
  }
}
