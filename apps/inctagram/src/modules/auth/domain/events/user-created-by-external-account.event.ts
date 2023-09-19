import { UserEntity } from '../../../users/domain/entity/user.entity';

export class UserCreatedByExternalAccountEvent {
  constructor(public readonly user: UserEntity) {}
}
