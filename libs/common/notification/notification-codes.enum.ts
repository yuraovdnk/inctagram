export enum NotificationCodesEnum {
  OK,
  ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  NOT_CONFIRMED,
  NOT_EXIST,
  CREATED,
  UPLOADED,
}

export const NotificationCodesEnumSwagger = Object.keys(
  NotificationCodesEnum,
).reduce((acc, key) => {
  const enumValue = NotificationCodesEnum[key];
  if (typeof enumValue === 'number') {
    acc[key] = enumValue;
  }
  return acc;
}, {});
