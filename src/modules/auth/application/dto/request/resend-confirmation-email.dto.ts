import { ApiProperty } from '@nestjs/swagger';
import { IsEmailInRFC5322 } from '../decorators/is-email-in-rfc5322.validate.decorator';

export class ResendConfirmationEmailDto {
  @ApiProperty({
    description: 'email',
    required: true,
    type: 'string',
    pattern: '^[w-.]+@([w-]+.)+[w-]{2,4}$',
  })
  @IsEmailInRFC5322()
  email: string;
}
