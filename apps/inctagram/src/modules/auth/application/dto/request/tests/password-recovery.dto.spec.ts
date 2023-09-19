import { PasswordRecoveryDto } from '../password-recovery.dto';
import { emailFieldTest } from './test-helpers/email-field-test';

describe('PasswordRecoveryDto', () => {
  const getValidDto = () => {
    const dto = new PasswordRecoveryDto();
    dto.email = 'test@gamil.com';
    return dto;
  };
  emailFieldTest('email', getValidDto());
});
