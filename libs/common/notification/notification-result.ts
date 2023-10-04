import {
  NotificationCodesEnum,
  NotificationCodesEnumSwagger,
} from './notification-codes.enum';
import { NotificationExtension } from './notification-extension';
import { ApiProperty } from '@nestjs/swagger';
import { IEvent } from '@nestjs/cqrs';
import { Exclude } from 'class-transformer';

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
  data: T | null;

  @Exclude()
  events: IEvent[] | undefined;

  hasError() {
    return !!this.extensions.length;
  }

  toViewResponse() {
    const { events, ...viewResponse } = this;
    return viewResponse;
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

export class SuccessResult<T> extends NotificationResult<T> {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.OK;

  constructor(data: T | null = null, events?: IEvent[]) {
    super();
    this.data = data;
    if (events) {
      this.events = [...events];
    }
  }
}

export class CreatedResult extends NotificationResult {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.CREATED;

  constructor(data: any = null) {
    super();
    this.data = data;
  }
}

export class SuccessUploaded extends NotificationResult {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.ERROR;

  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
}

export class InternalServerError extends NotificationResult {
  resultCode: NotificationCodesEnum = NotificationCodesEnum.ERROR;

  constructor(error: string, key?: string) {
    super();
    this.extensions.push(new NotificationExtension(error, key));
  }
}
