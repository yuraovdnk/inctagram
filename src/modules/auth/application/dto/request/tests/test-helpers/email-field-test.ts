import { validate } from 'class-validator';

export const emailFieldTest = (fieldTile: string, dto: any) => {
  describe('email', () => {
    beforeEach(() => {
      dto[fieldTile] = 'test@gamil.com';
    });
    it('should fail when dto.email is missing', async () => {
      delete dto.email;
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });
    it('should valid the email  TEST_1@TEST.ru', async () => {
      dto.email = 'TEST_1@TEST.ru';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
    it('should fail the email property is empty', async () => {
      dto.email = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property does not not include @', async () => {
      dto.email = '1.email.com';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property include illegal characters', async () => {
      dto.email = 'ddd]d@TES.Tru';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property include ..', async () => {
      dto.email = 'test@gamil..com';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
  });
};
