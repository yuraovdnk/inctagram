import { AggregateRoot } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../events/user.created.event';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';
export class UserEntity extends AggregateRoot {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  isConfirmedEmail: boolean;
  constructor() {
    super();
  }
  static create(username: string, email: string, passwordHash: string) {
    const user = new UserEntity();
    user.id = uuid();
    user.email = email;
    user.username = username;
    user.passwordHash = passwordHash;

    user.apply(new UserCreatedEvent(user));
    return user;
  }
  confirmEmail() {
    this.isConfirmedEmail = true;
  }
}
