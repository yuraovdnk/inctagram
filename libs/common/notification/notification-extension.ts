import { ApiProperty } from '@nestjs/swagger';

export class NotificationExtension {
  @ApiProperty({ required: false })
  public key: string | null;
  @ApiProperty()
  public message: string;
  constructor(message: string, key?: string | null) {
    this.message = message;
    this.key = key;
  }
}
