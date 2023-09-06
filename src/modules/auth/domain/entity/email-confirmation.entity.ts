import { add } from 'date-fns';
import { UserEntity } from '../../../users/domain/entity/user.entity';
import * as crypto from 'crypto';
import {
  NotificationResult,
  SuccessResult,
} from '../../../../core/common/notification/notification-result';
import { EmailConfirmationCode } from '@prisma/client';
import { UserCreatedEvent } from '../../../users/domain/events/user.created.event';

export class EmailConfirmationEntity implements EmailConfirmationCode {
  userId: string;
  code: string;
  createdAt: Date;
  expireAt: Date;
  user?: UserEntity;

  static create(user: UserEntity): NotificationResult<EmailConfirmationEntity> {
    const confirmCode = new EmailConfirmationEntity();
    confirmCode.code = crypto.webcrypto.randomUUID();
    confirmCode.userId = user.id;
    confirmCode.expireAt = add(new Date(), { hours: 1 });
    user.apply(new UserCreatedEvent(user, confirmCode.code));
    return new SuccessResult(confirmCode);
  }
}
