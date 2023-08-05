export interface IUserMock {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
export const userMock: IUserMock = {
  username: 'inctagram',
  email: 'test@gmail.com',
  password: 'testpassword',
  passwordConfirm: 'testpassword',
};

export const userMock2: IUserMock = {
  username: 'kyivstoner',
  email: 'kyivstoner@gmail.com',
  password: 'kyivstoner',
  passwordConfirm: 'kyivstoner',
};

export const mockToken = {
  expired:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWRlNzRkMS1mZWMzLTRmOGQtYTA4Mi1kMDE5MzE4YTU3ZjUiLCJkZXZpY2VJZCI6ImY1ZGU3NGQxLWZlYzMtNGY4ZC1hMDgyLWQwMTkzMThhNTdmNiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNjI2NTM5MDIyfQ.YtxYf-eAN9E1DIEsfBD0-x1gGn3KjhkcKFGv0qhPQZw',
  withNotExistingUser:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNWRlNzRkMS1mZWMzLTRmOGQtYTA4Mi1kMDE5MzE4YTU3ZjUiLCJkZXZpY2VJZCI6ImY1ZGU3NGQxLWZlYzMtNGY4ZC1hMDgyLWQwMTkzMThhNTdmNiIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODAxMjk2NjcwfQ.e0CehgKvryDTYktuAE5xCmifipPrz6czQ4WZsBeMiX8',
};
