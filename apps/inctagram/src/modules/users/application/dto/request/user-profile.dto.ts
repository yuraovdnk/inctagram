import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { IsOlderThan } from '../../../../../../../../libs/common/validate-decorators/is-older-than.validate.decorator';
import { IsUsernameValid } from '../../../../../../../../libs/common/validate-decorators/is-username-valid.validate.decorator';
import { IsFirstNameValid } from '../../../../../../../../libs/common/validate-decorators/is-first-name-valid.validate.decorator';

export class UserProfileDto {
  @ApiProperty({
    description: 'username',
    required: true,
    type: 'string',
    minLength: 6,
    maxLength: 30,
    example: 'Username',
  })
  @IsUsernameValid()
  username: string;

  @ApiProperty({
    description: 'firstName',
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 50,
    example: 'John',
  })
  @IsFirstNameValid()
  firstName: string;

  @ApiProperty({
    description: 'lastName',
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 50,
    example: 'Smith',
  })
  @IsFirstNameValid()
  lastName: string;

  @ApiProperty({
    description: 'country',
    required: false,
    nullable: true,
    example: 'England',
  })
  @IsOptional()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'city',
    required: false,
    nullable: true,
    example: 'London',
  })
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty({
    description: 'dateOfBirth',
    required: false,
    example: '2003-09-01T20:22:39.762Z',
  })
  @IsOlderThan(13)
  @IsDateString({ strict: false, strictSeparator: false })
  @IsOptional()
  dateOfBirth: string;

  @ApiProperty({
    description: 'aboutMe',
    required: false,
    nullable: true,
    maxLength: 200,
    example: 'Some text...',
  })
  @MaxLength(200)
  @IsOptional()
  aboutMe: string;
}
