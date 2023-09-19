import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsFirstNameValid(
  validationOptions?: ValidationOptions,
  minLength?: number,
  maxLength?: number,
) {
  const defaultMinLength = 1;
  const defaultMaxLength = 50;
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isUsernameValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const firstNameRegex = /^[A-Za-z0-9А-Яа-я' -]+$/;
          if (typeof value !== 'string' || !value) {
            return false;
          }
          if (
            value.length < (minLength ?? defaultMinLength) ||
            value.length > (maxLength ?? defaultMaxLength)
          ) {
            return false;
          }
          return firstNameRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${
            args.property
          }  should only contain letters from the Latin and Cyrillic alphabets, as well as the characters ',-, and space. Length should be between ${
            minLength ?? defaultMinLength
          } and ${maxLength ?? defaultMaxLength} characters.`;
        },
      },
    });
  };
}
