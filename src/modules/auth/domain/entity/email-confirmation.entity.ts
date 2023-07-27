import { add } from 'date-fns';
import * as crypto from 'crypto';

export class EmailConfirmationEntity {
  userId: string;
  code: string;
  createdAt: string;
  expireAt: Date;

  static create(userId: string) {
    const confirmCode = new EmailConfirmationEntity();
    confirmCode.code = crypto.webcrypto.randomUUID();
    confirmCode.userId = userId;
    confirmCode.expireAt = add(new Date(), { hours: 1 });
    return confirmCode;
  }
}
