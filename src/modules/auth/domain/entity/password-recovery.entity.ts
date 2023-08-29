import * as crypto from 'crypto';
import { add } from 'date-fns';
import { AggregateRoot } from '@nestjs/cqrs';
import { PasswordRecoveryEvent } from '../events/password-recovery.event';
import { UserEntity } from '../../../users/domain/entity/user.entity';

export class PasswordRecoveryEntity extends AggregateRoot {
  code: string;
  expireAt: Date;
  userId: string;
  createdAt: Date;

  constructor() {
    super();
  }
  static create(user: UserEntity): PasswordRecoveryEntity {
    const entity = new PasswordRecoveryEntity();
    entity.userId = user.id;
    entity.code = crypto.webcrypto.randomUUID();
    entity.expireAt = add(new Date(), { hours: 1 });
    entity.apply(new PasswordRecoveryEvent(user, entity));
    return entity;
  }
}
