import { validate } from 'class-validator';
import { PasswordRecoveryDto } from './password-recovery.dto';

describe('PasswordRecoveryDto', () => {
  it('should fail the email property if email is invalid', async () => {
    const passwordRecoveryDto = new PasswordRecoveryDto();
    passwordRecoveryDto.email = 'invalid-email'; // Set an invalid email address

    const errors = await validate(passwordRecoveryDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isEmail',
      'email must be an email',
    );
  });

  it('should fail the email property if email is empty', async () => {
    const passwordRecoveryDto = new PasswordRecoveryDto();
    const errors = await validate(passwordRecoveryDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isNotEmpty',
      'email is required',
    );
  });

  it('should validate the email property with a valid email', async () => {
    const passwordRecoveryDto = new PasswordRecoveryDto();
    passwordRecoveryDto.email = 'valid@email.com'; // Set a valid email address

    const errors = await validate(passwordRecoveryDto);
    expect(errors.length).toBe(0); // Expect no errors
  });
});
