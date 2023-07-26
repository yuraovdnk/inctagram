import * as crypto from 'crypto';
import { add } from 'date-fns';

export class PasswordRecoveryEntity {
  code: string;
  expireAt: Date;
  userId: string;
  createdAt: Date;
  static create(userId: string): PasswordRecoveryEntity {
    const entity = new PasswordRecoveryEntity();
    entity.userId = userId;
    entity.code = crypto.webcrypto.randomUUID();
    entity.expireAt = add(new Date(), { hours: 1 });
    return entity;
  }
}
