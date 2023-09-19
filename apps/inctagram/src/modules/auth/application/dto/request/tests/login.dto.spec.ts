import { emailFieldTest } from './test-helpers/email-field-test';
import { passwordFieldTest } from './test-helpers/password-field-test';
import { LoginDto } from '../login.dto';

describe('LoginDto', () => {
  const getValidDto = () => {
    const email = 'test@gamil.com';
    const password = 'SecurePassword_1';
    return new LoginDto(email, password);
  };
  emailFieldTest('email', getValidDto());
  passwordFieldTest('password', getValidDto());
});
