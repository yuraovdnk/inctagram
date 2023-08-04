import { validate } from 'class-validator';
import { NewPasswordDto } from './new-password.dto';

describe('NewPasswordDto', () => {
  let newPasswordDto: NewPasswordDto;
  const mockValidDto = () => {
    newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'SecurePassword@1'; // A valid password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode
  };
  const checkNewPasswordMatched = async (newPass: string) => {
    newPasswordDto.newPassword = newPass; // An invalid password
    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty('matches'); // Expect the matches constraint to fail
  };

  describe('common DTO test ', () => {
    beforeEach(() => {
      mockValidDto();
    });
    it('should validate a valid newPasswordDto', async () => {
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBe(0); // Expect no errors
    });
    it('should fail when newPassword is missing', async () => {
      newPasswordDto = new NewPasswordDto();
      newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect no errors
    });
    it('should fail when recoveryCode is missing', async () => {
      newPasswordDto = new NewPasswordDto();
      newPasswordDto.newPassword = 'SecurePassword@1'; // A valid password
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect no errors
    });
  });

  describe('newPassword', () => {
    beforeEach(() => {
      mockValidDto();
    });

    it('should fail when newPassword is empty', async () => {
      newPasswordDto.newPassword = ''; // An empty password
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the isStrongPassword constraint to fail
      expect(errors[0].constraints).toHaveProperty('matches'); // Expect the isStrongPassword constraint to fail
    });

    it('should fail when newPassword is too short', async () => {
      newPasswordDto.newPassword = 'Se@'; // A wrong password
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('minLength'); // Expect the matches constraint to fail
    });

    it('should fail when newPassword is too long', async () => {
      newPasswordDto.newPassword = 'ThisIsTooLongPassword@'; // A wrong password
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('maxLength'); // Expect the matches constraint to fail
    });

    it('should fail when newPassword does not not include uppercase', async () => {
      await checkNewPasswordMatched('passwordW@');
    });

    it('should fail when newPassword does not include lowercase', async () => {
      await checkNewPasswordMatched('QWERTY$@');
    });

    it('should fail when newPassword does not  include numbers', async () => {
      await checkNewPasswordMatched('SecureP@ssword');
    });

    it('should fail when newPassword does not include symbol', async () => {
      await checkNewPasswordMatched('SecurePassword1');
    });

    it('should fail when newPassword include invalid symbols', async () => {
      await checkNewPasswordMatched('Secure Password@1');
    });
  });

  describe('recoveryCode', () => {
    beforeEach(() => {
      mockValidDto();
    });

    it('should fail when recoveryCode is empty', async () => {
      newPasswordDto.recoveryCode = ''; // An empty password
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty(
        'isUuid',
        expect.any(String),
      ); // Expect the IsUUID constraint to fail
    });

    it('should fail when recoveryCode is invalid UUid', async () => {
      newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-42665544000'; // An empty password
      const errors = await validate(newPasswordDto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty(
        'isUuid',
        expect.any(String),
      ); // Expect the IsUUID constraint to fail
    });
  });
});
