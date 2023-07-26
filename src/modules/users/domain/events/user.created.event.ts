import { User } from '@prisma/client';
import { UserEntity } from '../entity/user.entity';

export class UserCreatedEvent {
  constructor(public readonly user: UserEntity) {}
}
