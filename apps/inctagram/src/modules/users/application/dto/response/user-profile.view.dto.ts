import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../../domain/entity/user.entity';

export class UserProfileViewDto {
  @ApiProperty({
    type: 'uuid',
    example: 'ad813e6f-90be-46ed-a0ce-2f094885f253',
  })
  userId: string;

  @ApiProperty({ example: 'Username' })
  username: string;

  @ApiProperty({
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    example: 'Smith',
  })
  lastName: string;

  @ApiProperty({
    example: 'London',
  })
  city: string;

  @ApiProperty({
    description: 'dateOfBirth',
    example: '2003-09-01T20:22:39.762Z',
  })
  dateOfBirth: string;

  @ApiProperty({
    description: 'aboutMe',
    example: 'Some text...',
  })
  aboutMe: string;

  @ApiProperty({
    description: 'avatar',
    format: 'url',
    example: 'https://s3.eu-central-1.amazonaws.com/example-bucket/avatar.png',
  })
  avatar: string;

  constructor(user: UserEntity) {
    this.userId = user.id;
    this.username = user.username;
    this.firstName = user.profile.firstName;
    this.lastName = user.profile.lastName;
    this.city = user.profile.city;
    this.dateOfBirth = user.profile.dateOfBirth.toISOString();
    this.aboutMe = user.profile.aboutMe;
    this.avatar = `https://inctagram-pirates.s3.eu-central-1.amazonaws.com/user-avatars/${user.profile.avatar}`;
  }
}
