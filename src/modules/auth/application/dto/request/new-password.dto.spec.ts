import { validate } from 'class-validator';
import { NewPasswordDto } from './new-password.dto';

describe('NewPasswordDto', () => {
  let newPasswordDto: NewPasswordDto;

  beforeEach(() => {
    newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'SecureP@ssw0rd'; // A valid password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode
  });

  it('should validate a valid newPassword', async () => {
    const errors = await validate(newPasswordDto);
    expect(errors.length).toBe(0); // Expect no errors
  });

  it('should fail when newPassword is empty', async () => {
    newPasswordDto.newPassword = ''; // An empty password
    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });

  it('should fail when newPassword is too short', async () => {
    const newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'Se@0'; // A wrong password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode

    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });

  it('should fail when newPassword does not include uppercase', async () => {
    const newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'securep@ssw0rd'; // A wrong password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode

    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });

  it('should fail when newPassword does not include lowercase', async () => {
    const newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'QWERTY$1'; // A wrong password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode

    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });

  it('should fail when newPassword does not include numbers', async () => {
    const newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'SecureP@ssword'; // A wrong password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode

    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });

  it('should fail when newPassword does not include symbol', async () => {
    const newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'SecurePassword'; // A wrong password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode

    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });

  it('should fail when newPassword include special symbols or space', async () => {
    const newPasswordDto = new NewPasswordDto();
    newPasswordDto.newPassword = 'Secure Password'; // A wrong password
    newPasswordDto.recoveryCode = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode

    const errors = await validate(newPasswordDto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty(
      'isStrongPassword',
      'newPassword is not strong enough',
    ); // Expect the isStrongPassword constraint to fail
  });
});
