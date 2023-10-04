import { UserEntity } from '../entity/user.entity';

export class UserCreatedEvent {
  constructor(public readonly user: UserEntity, public readonly code: string) {}
}
