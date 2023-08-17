import { UserEntity } from '../../../users/domain/entity/user.entity';
import { IEvent } from '@nestjs/cqrs';

export class ResentedConfirmCodeEvent implements IEvent {
  constructor(public readonly user: UserEntity) {}
}
