import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
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
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'email',
    required: true,
    type: 'string',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    description: 'password',
    required: true,
    type: 'string',
  })
  @MinLength(6)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'password confirmation',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
  })
  @MinLength(6)
  @MaxLength(30)
  @IsNotEmpty()
  passwordConfirm: string;
}
