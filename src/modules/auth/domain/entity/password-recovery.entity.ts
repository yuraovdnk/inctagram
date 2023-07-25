import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export class PasswordRecoveryEntity {
  recoveryCode: string;
  expirationDate: Date;
  email: string;
  static create(email: string): PasswordRecoveryEntity {
    const passwordRecoveryDomain = new PasswordRecoveryEntity();
    passwordRecoveryDomain.email = email;
    passwordRecoveryDomain.recoveryCode = uuidv4();
    passwordRecoveryDomain.expirationDate = add(new Date(), { hours: 24 });
    return passwordRecoveryDomain;
  }
}
