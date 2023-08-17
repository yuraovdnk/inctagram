import { add } from 'date-fns';
import { UserEntity } from '../../../users/domain/entity/user.entity';
import * as crypto from 'crypto';
import {
  BadResult,
  NotificationResult,
  SuccessResult,
} from '../../../../core/common/notification/notification-result';

export class EmailConfirmationEntity {
  userId: string;
  code: string;
  createdAt: Date;
  expireAt: Date;
  user?: UserEntity;

  static create(userId: string): NotificationResult<EmailConfirmationEntity> {
    const confirmCode = new EmailConfirmationEntity();
    confirmCode.code = crypto.webcrypto.randomUUID();
    confirmCode.userId = userId;
    confirmCode.expireAt = add(new Date(), { hours: 1 });

    return new SuccessResult(confirmCode);
  }
}
