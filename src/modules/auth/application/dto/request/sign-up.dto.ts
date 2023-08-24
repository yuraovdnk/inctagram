import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../decorators/is-strong-password.validate.decorator';
import { IsEmailInRFC5322 } from '../decorators/is-email-in-rfc5322.validate.decorator';
import { IsUsernameValid } from '../decorators/is-username-valid.validate.decorator';
import { equals, Equals, ValidateIf } from 'class-validator';
import { IsEqualToField } from '../decorators/is-equal-to-field.validate.decorator';

export class SignUpDto {
  @ApiProperty({
    description: 'username',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @IsUsernameValid()
  username: string;

  @ApiProperty({
    description: 'email. It must comply with RFC 5322',
    required: true,
    type: 'string',
  })
  @IsEmailInRFC5322()
  email: string;

  @ApiProperty({
    description: 'password',
    required: true,
    type: 'string',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'password confirmation',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @IsEqualToField('password')
  @IsStrongPassword()
  passwordConfirm: string;
}
