import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from '../../../../../core/common/validate-decorators/is-strong-password.validate.decorator';
import { IsEmailInRFC5322 } from '../../../../../core/common/validate-decorators/is-email-in-rfc5322.validate.decorator';
import { IsUsernameValid } from '../../../../../core/common/validate-decorators/is-username-valid.validate.decorator';
import { IsEqualToField } from '../../../../../core/common/validate-decorators/is-equal-to-field.validate.decorator';

export class SignUpDto {
  @ApiProperty({
    description: 'username, valid characters: A-Za-z0-9-_',
    example: 'Username',
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
    example: 'test@email.com',
  })
  @IsEmailInRFC5322()
  email: string;

  @ApiProperty({
    description: `password, valid characters: A-Za-z0-9!#$%*+-?^_`,
    example: 'Testpassword1*',
    required: true,
    type: 'string',
  })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'password confirmation, valid characters: A-Za-z0-9!#$%*+-?^_',
    example: 'Testpassword1*',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @IsEqualToField('password')
  @IsStrongPassword()
  passwordConfirm: string;
}
