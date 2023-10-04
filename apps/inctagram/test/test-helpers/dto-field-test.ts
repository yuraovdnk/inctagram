import { validate } from 'class-validator';

export const dtoFieldTest = (
  fieldTitle: string,
  mockDto: object,
  validValues: any[],
  invalidValues: any[],
) => {
  const mockValue = mockDto[fieldTitle];
  const testValue = async (newValue: string, isValid: boolean) => {
    mockDto[fieldTitle] = newValue;
    const errors = await validate(mockDto);
    if (errors.length && isValid) console.log(errors);
    isValid
      ? expect(errors.length).toBe(0)
      : expect(errors.length).toBeGreaterThan(0);
  };

  for (const validValue of validValues) {
    mockDto[fieldTitle] = mockValue;
    it(`should valid if ${fieldTitle} is "${validValue}"`, async () => {
      await testValue(validValue, true);
    });
  }

  for (const invalidValue of invalidValues) {
    mockDto[fieldTitle] = mockValue;
    it(`should fault if ${fieldTitle} is "${invalidValue}"`, async () => {
      await testValue(invalidValue, false);
    });
  }
};
