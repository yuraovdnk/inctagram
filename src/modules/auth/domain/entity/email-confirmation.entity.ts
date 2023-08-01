import { add } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { UserEntity } from '../../../users/domain/entity/user.entity';
import * as crypto from 'crypto';

export class EmailConfirmationEntity {
  userId: string;
  code: string;
  createdAt: Date;
  expireAt: Date;
  user?: UserEntity;

  static create(userId: string) {
    const confirmCode = new EmailConfirmationEntity();
    confirmCode.code = crypto.webcrypto.randomUUID();
    confirmCode.userId = userId;
    confirmCode.expireAt = add(new Date(), { hours: 1 });
    return confirmCode;
  }
}
