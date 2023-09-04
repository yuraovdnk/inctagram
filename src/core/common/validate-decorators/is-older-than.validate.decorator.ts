import { registerDecorator, ValidationOptions } from 'class-validator';
import { differenceInYears } from 'date-fns/fp';

export function IsOlderThan(
  minAge: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isOlderThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (!value) {
            return false;
          }
          const userAge = differenceInYears(new Date(value), new Date());
          return userAge > minAge && userAge < 120;
        },
        defaultMessage() {
          return 'user must be over 13 years old';
        },
      },
    });
  };
}
