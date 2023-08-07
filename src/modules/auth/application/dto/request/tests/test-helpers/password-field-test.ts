import { validate } from 'class-validator';

export const passwordFieldTest = (fieldTitle: string, dto: any) => {
  describe(fieldTitle, () => {
    const testPasswordField = async (newPass: string) => {
      dto[fieldTitle] = newPass; // a new password
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect errors to be greater than 0
      expect(errors[0].constraints).toHaveProperty('isStrongPassword'); // Expect the isStrongPassword constraint to fail
    };
    beforeEach(() => {
      dto[fieldTitle] = 'SecurePassword@1';
    });
    it(`should fail when  ${fieldTitle} is missing`, async () => {
      delete dto[fieldTitle];
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0); // Expect  errors
    });
    it(`should fail when ${fieldTitle} is empty`, async () => {
      await testPasswordField('');
    });
    it(`should fail when ${fieldTitle} is too short`, async () => {
      await testPasswordField('Se@');
    });
    it(`should fail when ${fieldTitle} is too long`, async () => {
      await testPasswordField('ThisIsTooLongPassword@');
    });
    it(`should fail when ${fieldTitle} does not not include uppercase`, async () => {
      await testPasswordField('passwordW@');
    });
    it(`should fail when ${fieldTitle} does not include lowercase`, async () => {
      await testPasswordField('QWERTY$@');
    });
    it(`should fail when ${fieldTitle} does not  include numbers`, async () => {
      await testPasswordField('SecureP@ssword');
    });
    it(`should fail when ${fieldTitle} does not include symbol`, async () => {
      await testPasswordField('SecurePassword1');
    });
    it(`should fail when ${fieldTitle} include invalid symbols`, async () => {
      await testPasswordField('Secure Password@1');
    });
  });
};
