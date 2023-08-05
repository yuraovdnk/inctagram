import { validate } from 'class-validator';
import { SignUpDto } from './sign-up.dto';

describe('SignUpDto', () => {
  let dto: SignUpDto;
  const testPasswordMatched = async (prop: string, newPass: string) => {
    dto[prop] = newPass; // An invalid password
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty('matches'); // Expect the matches constraint to fail
  };
  const mockValidDto = () => {
    dto = new SignUpDto();
    dto.username = 'Username1';
    dto.email = 'test@gamil.com';
    dto.password = 'SecurePassword@1';
    dto.passwordConfirm = 'SecurePassword@1';
  };

  describe('common DTO test ', () => {
    beforeEach(() => {
      mockValidDto();
    });
    it('should validate a valid Dto', async () => {
      const errors = await validate(dto);
      expect(errors.length).toBe(0); // Expect no errors
    });

    it('should fail when dto.username is missing', async () => {
      delete dto.username;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });

    it('should fail when dto.email is missing', async () => {
      delete dto.email;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });

    it('should fail when dto.password is missing', async () => {
      delete dto.password;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });

    it('should fail when dto.passwordConfirm is missing', async () => {
      delete dto.passwordConfirm;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });
  });

  describe('username', () => {
    beforeEach(() => {
      mockValidDto();
    });

    it('should fail when username is empty', async () => {
      dto.username = ''; // An empty password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the isStrongPassword constraint to fail
      expect(errors[0].constraints).toHaveProperty('matches'); // Expect the isStrongPassword constraint to fail
    });

    it('should fail when username is too short', async () => {
      dto.username = 'User'; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the matches constraint to fail
    });

    it('should fail when username is too long', async () => {
      dto.username = 'ThisIsTooLongUserNameThisIsTooLongUserName'; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('maxLength'); // Expect the matches constraint to fail
    });

    it('should fail when username includes invalid symbols', async () => {
      dto.username = 'Username '; // A wrong username
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('matches'); // Expect the matches constraint to fail
    });
  });

  describe('email', () => {
    beforeEach(() => {
      mockValidDto();
    });
    it('should fail the email property is empty', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });
    it('should fail if the email property is invalid', async () => {
      dto.email = '1.email.com';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });
  });

  describe('password', () => {
    beforeEach(() => {
      mockValidDto();
    });

    it('should fail when newPassword is empty', async () => {
      dto.password = ''; // An empty password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the isStrongPassword constraint to fail
      expect(errors[0].constraints).toHaveProperty('matches'); // Expect the isStrongPassword constraint to fail
    });

    it('should fail when password is too short', async () => {
      dto.password = 'Se@'; // A wrong password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the matches constraint to fail
    });

    it('should fail when password is too long', async () => {
      dto.password = 'ThisIsTooLongPassword@'; // A wrong password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('maxLength'); // Expect the matches constraint to fail
    });

    it('should fail when password does not not include uppercase', async () => {
      await testPasswordMatched('password', 'passwordW@');
    });

    it('should fail when password does not include lowercase', async () => {
      await testPasswordMatched('password', 'QWERTY$@');
    });

    it('should fail when password does not  include numbers', async () => {
      await testPasswordMatched('password', 'SecureP@ssword');
    });

    it('should fail when password does not include symbol', async () => {
      await testPasswordMatched('password', 'SecurePassword1');
    });

    it('should fail when password include invalid symbols', async () => {
      await testPasswordMatched('password', 'Secure Password@1');
    });
  });

  describe('passwordConfirm', () => {
    beforeEach(() => {
      mockValidDto();
    });

    it('should fail when passwordConfirm is empty', async () => {
      dto.passwordConfirm = ''; // An empty password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the isStrongPassword constraint to fail
      expect(errors[0].constraints).toHaveProperty('matches'); // Expect the isStrongPassword constraint to fail
    });

    it('should fail when passwordConfirm is too short', async () => {
      dto.passwordConfirm = 'Se@'; // A wrong password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the matches constraint to fail
    });

    it('should fail when passwordConfirm is too long', async () => {
      dto.passwordConfirm = 'ThisIsTooLongPassword@'; // A wrong password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('maxLength'); // Expect the matches constraint to fail
    });

    it('should fail when passwordConfirm does not not include uppercase', async () => {
      await testPasswordMatched('passwordConfirm', 'passwordW@');
    });

    it('should fail when passwordConfirm does not include lowercase', async () => {
      await testPasswordMatched('passwordConfirm', 'QWERTY$@');
    });

    it('should fail when passwordConfirm does not  include numbers', async () => {
      await testPasswordMatched('passwordConfirm', 'SecureP@ssword');
    });

    it('should fail when passwordConfirm does not include symbol', async () => {
      await testPasswordMatched('passwordConfirm', 'SecurePassword1');
    });

    it('should fail when passwordConfirm include invalid symbols', async () => {
      await testPasswordMatched('passwordConfirm', 'Secure Password@1');
    });
  });
});
