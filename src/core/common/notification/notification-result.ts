import { NotificationExtension } from './notififcation-extention';
import { NotificationCodesEnum } from './notification-codes.enum';

export class NotificationResult<T = null> {
  extensions: NotificationExtension[] = [];
  code = NotificationCodesEnum.OK;
  data: T | null = null;
  hasError() {
    return this.code !== NotificationCodesEnum.OK;
  }
  addError(message: string, code?: number | null, key?: string | null) {
    this.code = code ?? NotificationCodesEnum.ERROR;
    const extension = new NotificationExtension(message, key);
    this.extensions.push(extension);
  }
  addData(data: T) {
    this.data = data;
  }
}
