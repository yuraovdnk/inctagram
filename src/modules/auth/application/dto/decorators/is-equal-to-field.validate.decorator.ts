import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEqualToField(
  targetPropertyName: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'IsEqualToField',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (typeof value !== 'string' || !value) {
            return false;
          }
          return value === args.object[targetPropertyName];
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} value must be equal to ${targetPropertyName}`;
        },
      },
    });
  };
}
