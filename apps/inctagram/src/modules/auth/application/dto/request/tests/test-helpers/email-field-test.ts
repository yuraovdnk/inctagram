import { validate } from 'class-validator';

export const emailFieldTest = (fieldTile: string, dto: any) => {
  describe('email', () => {
    beforeEach(() => {
      dto[fieldTile] = 'test@gamil.com';
    });
    it('should fail when dto.email is missing', async () => {
      delete dto[fieldTile];
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });
    it('should valid the email  TEST_1@TEST.ru', async () => {
      dto[fieldTile] = 'TEST_1@TEST.ru';
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
    it('should fail the email property is empty', async () => {
      dto[fieldTile] = '';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property does not not include @', async () => {
      dto[fieldTile] = '1.email.com';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property include illegal characters', async () => {
      dto[fieldTile] = 'ddd]d@TES.Tru';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property include ..', async () => {
      dto[fieldTile] = 'test@gamil..com';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
    it('should fail if the email property do not include .', async () => {
      dto[fieldTile] = 'test@gamilcom';
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('IsStrongEmail');
    });
  });
};
