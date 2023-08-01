import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
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
  @IsString()
  @IsNotEmpty()
  password: string;
  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
