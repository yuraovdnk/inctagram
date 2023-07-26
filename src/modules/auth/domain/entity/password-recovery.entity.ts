import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export class PasswordRecoveryEntity {
  code: string;
  expireAt: Date;
  userId: string;
  static create(userId: string): PasswordRecoveryEntity {
    const entity = new PasswordRecoveryEntity();
    entity.userId = userId;
    entity.code = uuidv4();
    entity.expireAt = add(new Date(), { hours: 1 });
    return entity;
  }
}
