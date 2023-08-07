import { validate } from 'class-validator';
import { ConfirmEmailDto } from '../confirm-email.dto';

describe('ConfirmEmailDto', () => {
  let dto: ConfirmEmailDto;
  const getValidDto = () => {
    dto = new ConfirmEmailDto();
    dto.code = '123e4567-e89b-12d3-a456-426655440000'; // A valid UUID recoveryCode
    return dto;
  };

  beforeEach(() => {
    dto = getValidDto();
  });
  it('should validate a valid ConfirmEmailDto', async () => {
    const errors = await validate(dto);
    expect(errors.length).toBe(0); // Expect no errors
  });
  it('should fail when recoveryCode is missing', async () => {
    delete dto.code;
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect no errors
    console.log(errors[0].constraints);
    expect(errors[0].constraints.isUuid).not.toBeUndefined(); // Expect the IsUUID constraint to fail
  });

  it('should fail when recoveryCode is empty', async () => {
    dto.code = ''; // An empty password
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty('isUuid', expect.any(String)); // Expect the IsUUID constraint to fail
  });
  it('should fail when recoveryCode is invalid UUid', async () => {
    dto.code = '123e4567-e89b-12d3-a456-42665544000'; // An empty password
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
    expect(errors[0].constraints).toHaveProperty('isUuid', expect.any(String)); // Expect the IsUUID constraint to fail
  });
});
