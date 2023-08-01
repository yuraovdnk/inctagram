import { SignUpDto } from '../../src/modules/auth/application/dto/request/signUp.dto';
import process from 'process';
import { DbTestHelper } from './db-test-helper';
import { User } from '@prisma/client';

export class UserTestHelper {
  private dbTestHelper;
  private emails: string[] = [];
  constructor() {
    this.dbTestHelper = new DbTestHelper();
    this.emails.push(process.env.EMAIL1);
    this.emails.push(process.env.EMAIL2);
  }
  generateSignUpDto(n: number): SignUpDto {
    return {
      email: n < 3 ? this.emails[n - 1] : `user${n}@gmail.com`,
      password: '123',
      passwordConfirm: '123',
      username: `user${n}`,
    };
  }
  //Generate input user DTO and create users in DB. n -  how many users to create.
  async createUsers(n: number): Promise<User[]> {
    const users = [];
    for (let i = 0; i < n; i++) {
      const signUpDto = this.generateSignUpDto(i + 1);
      const user = await this.dbTestHelper.creatUser(signUpDto);
      users.push(user[0]);
    }
    return users;
  }
}
