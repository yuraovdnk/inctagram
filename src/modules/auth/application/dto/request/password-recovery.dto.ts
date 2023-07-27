import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PasswordRecoveryDto {
  @ApiProperty({
    description: 'email',
    required: true,
    type: 'string',
    pattern: '^[w-.]+@([w-]+.)+[w-]{2,4}$',
  })
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;
}
