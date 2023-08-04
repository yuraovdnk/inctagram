import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    description: 'username',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @MinLength(6)
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'Username should only contain letters and numbers',
  })
  username: string;

  @ApiProperty({
    description: 'email',
    required: true,
    type: 'string',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'password',
    required: true,
    type: 'string',
  })
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).+$/,
    {
      message: 'newPassword is invalid',
    },
  )
  password: string;

  @ApiProperty({
    description: 'password confirmation',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @MinLength(6)
  @MaxLength(20)
  @Matches(
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s)(?=.*[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]).+$/,
    {
      message: 'newPassword is invalid',
    },
  )
  passwordConfirm: string;
}
