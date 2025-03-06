import { AggregateRoot } from '@nestjs/cqrs';
import { v4 as uuid } from 'uuid';
import { ExternalAccountEntity } from './external-account.entity';
import { UserProfileEntity } from './user-profile.entity';
import { UserProfileDto } from '../../application/dto/request/user-profile.dto';
import { AccountEntity } from './account.entity';
import { EmailConfirmationEntity } from '../../../auth/domain/entity/email-confirmation.entity';

export class UserEntity extends AggregateRoot {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  passwordHash: string;
  isConfirmedEmail: boolean;
  externalAccounts: ExternalAccountEntity[] = [];
  profile: UserProfileEntity;
  account: AccountEntity;
  emailConfirmation: EmailConfirmationEntity;

  constructor() {
    super();
  }

  static create(
    username: string,
    email: string,
    passwordHash: string,
    isConfirmed = false,
  ) {
    const user = new UserEntity();
    user.id = uuid();
    user.email = email;
    user.username = username;
    user.passwordHash = passwordHash;
    user.isConfirmedEmail = isConfirmed;
    return user;
  }

  confirmEmail() {
    this.isConfirmedEmail = true;
  }

  setProfile(dto: UserProfileDto) {
    this.username = dto.username;
    this.profile = new UserProfileEntity(dto);
  }

  createEmailConfirmation() {
    const resultCreateEntity = EmailConfirmationEntity.create(this);
    this.emailConfirmation = resultCreateEntity.data;
  }
}
