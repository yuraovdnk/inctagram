import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsUsernameValid(
  validationOptions?: ValidationOptions,
  minLength?: number,
  maxLength?: number,
) {
  const defaultMinLength = 6;
  const defaultMaxLength = 30;
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isUsernameValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          const usernameRegex = /^[A-Za-z0-9]+$/;
          if (typeof value !== 'string' || !value) {
            return false;
          }
          if (
            value.length < (minLength ?? defaultMinLength) ||
            value.length > (maxLength ?? defaultMaxLength)
          ) {
            return false;
          }
          return usernameRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${
            args.property
          }  should only contain letters and numbers. Length should be between ${
            minLength ?? defaultMinLength
          } and ${maxLength ?? defaultMaxLength} characters.`;
        },
      },
    });
  };
}
