import { UserEntity } from '../../../users/domain/entity/user.entity';
import { IEvent } from '@nestjs/cqrs';
import { PasswordRecoveryEntity } from '../entity/password-recovery.entity';

export class PasswordRecoveryEvent implements IEvent {
  constructor(
    public readonly userEntity: UserEntity,
    public readonly passwordRecoveryEntity: PasswordRecoveryEntity,
  ) {}
}
