import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStrongPassword(
  validationOptions?: ValidationOptions,
  minLength?: number,
  maxLength?: number,
) {
  const defaultMinLength = 6;
  const defaultMaxLength = 20;
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).+$/;
          if (typeof value !== 'string' || !value) {
            return false;
          }
          if (
            value.length < (minLength ?? defaultMinLength) ||
            value.length > (maxLength ?? defaultMaxLength)
          ) {
            return false;
          }
          return passwordRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${
            args.property
          } should contain at least one uppercase letter, one lowercase letter, one digit, and one special character. Length should be between ${
            minLength ?? defaultMinLength
          } and ${maxLength ?? defaultMaxLength} characters.`;
        },
      },
    });
  };
}
