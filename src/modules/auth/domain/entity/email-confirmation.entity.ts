import { add } from 'date-fns';
import { v4 as uuid } from 'uuid';

export class EmailConfirmationEntity {
  userId: string;
  code: string;
  createdAt: string;
  expireAt: Date;

  static create(userId: string) {
    const confirmCode = new EmailConfirmationEntity();
    confirmCode.code = uuid();
    confirmCode.userId = userId;
    confirmCode.expireAt = add(new Date(), { hours: 1 });
    return confirmCode;
  }
}
