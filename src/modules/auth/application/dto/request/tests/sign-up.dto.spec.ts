import { validate } from 'class-validator';
import { SignUpDto } from '../sign-up.dto';
import { emailFieldTest } from './test-helpers/email-field-test';
import { passwordFieldTest } from './test-helpers/password-field-test';

describe('SignUpDto', () => {
  let dto: SignUpDto;
  const getValidDto = () => {
    dto = new SignUpDto();
    dto.username = 'Username1';
    dto.email = 'test@gamil.com';
    dto.password = 'SecurePassword_1';
    dto.passwordConfirm = 'SecurePassword_1';
    return dto;
  };
  it('should validate a valid Dto', async () => {
    const errors = await validate(dto);
    console.log(errors);
    expect(errors.length).toBe(0); // Expect no errors
  });
  it('should fault if password!=confirm password', async () => {
    dto.password = dto.password + '1';
    const errors = await validate(dto);
    console.log('errors:', errors);
    expect(errors.length).toBeGreaterThan(0); // Expect no errors
  });

  describe('username', () => {
    beforeEach(() => {
      dto = getValidDto();
    });
    it('should fail when dto.username is missing', async () => {
      delete dto.username;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });
    it('should fail when username is empty', async () => {
      dto.username = ''; // An empty password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isUsernameValid'); // Expect the isStrongPassword constraint to fail
    });
    it('should fail when username is too short', async () => {
      dto.username = 'User'; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isUsernameValid'); // Expect the matches constraint to fail
    });
    it('should fail when username is too long', async () => {
      dto.username = 'ThisIsTooLongUserNameThisIsTooLongUserName'; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isUsernameValid'); // Expect the matches constraint to fail
    });
    it('should fail when username includes invalid symbols', async () => {
      dto.username = 'User name '; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isUsernameValid'); // Expect the matches constraint to fail
    });
    it('should fail when username includes invalid symbols -ru', async () => {
      dto.username = 'Анфиса'; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isUsernameValid'); // Expect the matches constraint to fail
    });
  });
  emailFieldTest('email', getValidDto());
  passwordFieldTest('password', getValidDto());
  passwordFieldTest('passwordConfirm', getValidDto());
});
