import { UserProfileDto } from '../../src/modules/users/application/dto/request/user-profile.dto';
import { of } from 'rxjs';
import { SuccessResult } from '../../../../libs/common/notification/notification-result';
import { ClientProxy } from '@nestjs/microservices';

export interface IUserMock {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export const userMock: IUserMock = {
  username: 'Inctagram23',
  email: 'inctagram@gmail.com',
  password: 'Password-123',
  passwordConfirm: 'Password-123',
};

export const userMock2: IUserMock = {
  username: 'Testing23',
  email: 'testing@gmail.com',
  password: 'Password-123',
  passwordConfirm: 'Password-123',
};

export const mockToken = {
  expired:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWRlNzRkMS1mZWMzLTRmOGQtYTA4Mi1kMDE5MzE4YTU3ZjUiLCJkZXZpY2VJZCI6ImY1ZGU3NGQxLWZlYzMtNGY4ZC1hMDgyLWQwMTkzMThhNTdmNiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjI2NTM5MDIyfQ.YtxYf-eAN9E1DIEsfBD0-x1gGn3KjhkcKFGv0qhPQZw',
  withNotExistingUser:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWRlNzRkMS1mZWMzLTRmOGQtYTA4Mi1kMDE5MzE4YTU3ZjUiLCJkZXZpY2VJZCI6ImY1ZGU3NGQxLWZlYzMtNGY4ZC1hMDgyLWQwMTkzMThhNTdmNiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODAxMjk2NjcwfQ.e0CehgKvryDTYktuAE5xCmifipPrz6czQ4WZsBeMiX8',
};

export const createUserProfileDtoMock: UserProfileDto = {
  username: 'Username1',
  aboutMe: 'About Me text ...',
  city: 'London',
  dateOfBirth: '2003-09-01T20:22:39.762Z',
  firstName: 'John',
  country: 'England',
  lastName: 'Smith',
};

export const emailServiceMock = {
  sendPasswordRecoveryCodeEmail: jest.fn(),
  sendConfirmCode: jest.fn(),
  sendMailWithSuccessRegistration: jest.fn(),
};
export const eventBusMock = {
  register: jest.fn(),
  registerSagas: jest.fn(),
  publish: jest.fn(),
};

export const fileServiceMockResponse = {
  fileName: 'b15a6eef-ac4a-46f3-b05f-1f65fba6c685_avatar.jpeg',
};
