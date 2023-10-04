import { UserProfileDto } from '../../application/dto/request/user-profile.dto';

export class UserProfileEntity {
  createdAt: Date;
  updatedAt: Date | null;
  firstName: string;
  lastName: string;
  city: string;
  dateOfBirth?: Date;
  aboutMe?: string;
  avatar?: string;
  constructor(dto: UserProfileDto) {
    this.firstName = dto.firstName;
    this.lastName = dto.lastName;
    this.city = dto.city;
    this.dateOfBirth = dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined;
    this.aboutMe = dto.aboutMe;
    this.avatar = dto.avatar;
  }
}
