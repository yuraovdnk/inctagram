export enum NotificationCodesEnum {
  OK,
  ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  NOT_CONFIRMED,
  NOT_EXIST,
}
export const NotificationCodesEnumSwagger: typeof NotificationCodesEnum = {
  OK: 0,
  ERROR: 1,
  BAD_REQUEST: 2,
  UNAUTHORIZED: 3,
  FORBIDDEN: 4,
  NOT_FOUND: 5,
  NOT_CONFIRMED: 6,
  NOT_EXIST: 7,
} as const;
