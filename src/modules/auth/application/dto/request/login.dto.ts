import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsStrongPassword } from '../../../../../core/common/validate-decorators/is-strong-password.validate.decorator';
import { IsEmailInRFC5322 } from '../../../../../core/common/validate-decorators/is-email-in-rfc5322.validate.decorator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'email must comply with RFC 5322',
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
    minLength: 6,
    maxLength: 30,
  })
  @IsStrongPassword()
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
