import {
  NotificationCodesEnum,
  NotificationCodesEnumSwagger,
} from './notification-codes.enum';
import { NotificationExtension } from './notification-extension';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationResult<T = null> {
  @ApiProperty({
    type: Number,
    description: JSON.stringify(NotificationCodesEnumSwagger),
  })
  resultCode: NotificationCodesEnum;

  @ApiProperty({
    type: [NotificationExtension],
    default: [],
  })
  extensions: NotificationExtension[] = [];

  @ApiProperty({ type: {} })
  data: T | null = null;

  hasError() {
    return !!this.extensions.length;
  }
}

export class BadResult extends NotificationResult {
  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
  resultCode: NotificationCodesEnum = NotificationCodesEnum.BAD_REQUEST;
}

export class NotFoundResult extends NotificationResult {
  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
  resultCode: NotificationCodesEnum = NotificationCodesEnum.NOT_FOUND;
}

export class UnAuthorizedResult extends NotificationResult {
  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
  resultCode: NotificationCodesEnum = NotificationCodesEnum.UNAUTHORIZED;
}

export class ForbiddenResult extends NotificationResult {
  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
  resultCode: NotificationCodesEnum = NotificationCodesEnum.FORBIDDEN;
}

export class SuccessResult extends NotificationResult {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.OK;

  constructor(data: any = null) {
    super();
    this.data = data;
  }
}
export class CreatedResult extends NotificationResult {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.CREATED;

  constructor(data: any = null) {
    super();
    this.data = data;
  }
}

export class InternalServerError extends NotificationResult {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.ERROR;

  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
}
