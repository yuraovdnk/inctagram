import { SignUpDto } from '../../src/modules/auth/application/dto/request/sign-up.dto';
import { DbTestHelper } from './db-test-helper';
import { User } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/application/service/auth.service';

export type ExtendedUser = User & { password: string };
export class UserTestHelper {
  private dbTestHelper: DbTestHelper;
  private authService: AuthService;

  constructor(private app: INestApplication) {
    this.dbTestHelper = new DbTestHelper();
    this.authService = app.get(AuthService);
  }
  generateSignUpDto(n: number): SignUpDto {
    return {
      email: `user${n}@gmail.com`,
      password: `_Password${n}`,
      passwordConfirm: `_Password${n}`,
      username: `user${n}`,
    };
  }
  //Generate input user DTO and create users in DB. n -  how many users to create.
  async createUsers(n: number): Promise<ExtendedUser[]> {
    const users: ExtendedUser[] = [];
    for (let i = 0; i < n; i++) {
      const { email, username, password } = this.generateSignUpDto(i + 1);
      const passwordHash = this.authService.getPasswordHash(password);
      const user = await this.dbTestHelper.creatUser(
        email,
        username,
        passwordHash,
      );

      users.push({ ...user, password });
    }
    return users;
  }
}
