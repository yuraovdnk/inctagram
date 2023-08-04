import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'login',
    required: true,
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'password',
    required: true,
    type: 'string',
  })
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).+$/,
    {
      message: 'newPassword is invalid',
    },
  )
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
