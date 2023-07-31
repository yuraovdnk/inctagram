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
export interface IUserMock {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
