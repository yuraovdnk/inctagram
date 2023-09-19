import { ApiProperty } from '@nestjs/swagger';
import { IsEmailInRFC5322 } from '../../../../../../../../libs/common/validate-decorators/is-email-in-rfc5322.validate.decorator';

export class ResendConfirmationEmailDto {
  @ApiProperty({
    description: 'email.It must comply with RFC 5322',
    required: true,
    type: 'string',
    pattern: '^[w-.]+@([w-]+.)+[w-]{2,4}$',
    example: 'test@email.com',
  })
  @IsEmailInRFC5322()
  email: string;
}
