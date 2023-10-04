import { validate } from 'class-validator';
import { NewPasswordDto } from '../new-password.dto';
import { passwordFieldTest } from './test-helpers/password-field-test';

describe('NewPasswordDto', () => {
  const getValidDto = () => {
    const dto = new NewPasswordDto();
    dto.newPassword = 'SecurePassword_1'; // A valid password
    dto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode
    return dto;
  };
  let dto = getValidDto();

  it('should validate a valid newPasswordDto', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Expect no errors
  });

  passwordFieldTest('newPassword', getValidDto());

  describe('recoveryCode', () => {
    beforeEach(() => {
      dto = getValidDto();
    });
    it('should fail when recoveryCode is missing', async () => {
      delete dto.recoveryCode;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect no errors
    });
    it('should fail when recoveryCode is empty', async () => {
      dto.recoveryCode = ''; // An empty password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty(
        'isUuid',
        expect.any(String),
      ); // Expect the IsUUID constraint to fail
    });
    it('should fail when recoveryCode is invalid UUid', async () => {
      dto.recoveryCode = '123e4567-e89b-12d3-a456-42665544000'; // An empty password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty(
        'isUuid',
        expect.any(String),
      ); // Expect the IsUUID constraint to fail
    });
  });
});
