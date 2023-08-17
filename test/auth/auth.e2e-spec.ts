import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DbTestHelper } from '../test-helpers/db-test-helper';
import { ExtendedUser, UserTestHelper } from '../test-helpers/user.test.helper';
import { mockToken, userMock, userMock2 } from '../mocks/mocks';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { AuthTestHelper } from '../test-helpers/auth-test.helper';
import { EmailConfirmationEntity } from '../../src/modules/auth/domain/entity/email-confirmation.entity';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';
import { setupApp } from '../../src/main';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';

jest.setTimeout(20000);
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let users: ExtendedUser[];
  let usersRepository: UsersRepository;
  let userTestHelper: UserTestHelper;
  let authHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = setupApp(app);
    await app.init();
    await dbTestHelper.clearDb();
    usersRepository = app.get(UsersRepository);
    authHelper = new AuthTestHelper(app);
    userTestHelper = new UserTestHelper(app);
  });
  describe('GET:[HOST]/auth/me - get user info', () => {
    let accessTokenUser: string;
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      users = await userTestHelper.createUsers(1);
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: users[0]?.email,
          password: users[0]?.password,
        })
        .set('user-agent', 'test')
        .expect(HttpStatus.OK);
      expect(res.body.accessToken).toBeDefined();
      accessTokenUser = res.body.accessToken;
    });
    it('POST:[HOST]/auth/me: should return code 200 and users data.', async () => {
      const result = await request(app.getHttpServer())
        .get('/auth/me')
        .auth(accessTokenUser, { type: 'bearer' })
        .expect(HttpStatus.OK);
      // expect(result.body).toEqual({
      //   username: users[0]?.username,
      //   email: users[0]?.email,
      //   userId: users[0]?.id,
      // });
    });
  });

  describe('POST:[HOST]/auth/password-recovery', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      users = await userTestHelper.createUsers(1);
    });

    it('POST:[HOST]/auth/password-recovery: should return code 400 If email is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: 'fake^^gmail.com',
        })
        .expect(HttpStatus.OK);
    });
    it('POST:[HOST]/auth/password-recovery: should return code 204 If the email is correct', async () => {
      await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: users[0].email,
        })
        .expect(HttpStatus.OK);
    });
    it('POST:[HOST]/auth/password-recovery: should return code 204 If the email is correct but email is not in dataBase', async () => {
      await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: 'email1111@gmail.com',
        })
        .expect(HttpStatus.OK);
    });
    // it('POST:[HOST]/auth/password-recovery: should return code 429 If More than 5 attempts from one IP-address during 10 seconds', async () => {
    //   await request(app.getHttpServer())
    //     .post('/auth/password-recovery')
    //     .send({
    //       email: 'email1111@gmail.com',
    //     })
    //     .expect(HttpStatus.NO_CONTENT);
    //
    //   await request(app.getHttpServer())
    //     .post('/auth/password-recovery')
    //     .send({
    //       email: 'email1111@gmail.com',
    //     })
    //     .expect(HttpStatus.NO_CONTENT);
    //
    //   await request(app.getHttpServer())
    //     .post('/auth/password-recovery')
    //     .send({
    //       email: 'email1111@gmail.com',
    //     })
    //     .expect(HttpStatus.TOO_MANY_REQUESTS);
    // });
  });

  describe('POST:[HOST]/auth/signup - registration', () => {
    it('should not register if username is incorrect', async () => {
      await authHelper.signUp(
        {
          username: 'testusername',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );

      await authHelper.signUp(
        {
          username: 'test',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
    });

    it('should register user with correct data', async function () {
      await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email@gmail.com',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
    });

    it('should not register if email is incorrect ', async function () {
      await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );

      await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'ema@gmail.com',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
    });

    it('should not register if password is incorrect ', async function () {
      await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email@gmail.com',
          password: 'password',
          passwordConfirm: 'password',
        },
        HttpStatus.OK,
      );
    });

    it('should not register if confirm password not equal password', async function () {
      await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email@gmail.com',
          password: 'password',
          passwordConfirm: 'StrongPassword@',
        },
        HttpStatus.OK,
      );
    });

    it('should register user', async function () {
      await authHelper.signUp(userMock, HttpStatus.OK);

      //if already registered
      await authHelper.signUp(userMock, HttpStatus.OK);

      //user should be not confirmed
      const user = await usersRepository.findByEmail(userMock.email);
      expect(user.isConfirmedEmail).toBeFalsy();
    });
  });

  describe('POST:[HOST]/auth/registration-confirmation - confirmation email', () => {
    let emailConfirmCode: EmailConfirmationEntity;
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      const createdUser = await authHelper.createUser(userMock);
      emailConfirmCode = await authHelper.createConfirmCode(createdUser, 15);
    });
    it('should not confirm if code is incorrect', async function () {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: uuid(),
        })
        .expect(HttpStatus.OK);
    });

    it('should not confirm if input code value is incorrect ', async function () {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: '2fdg342',
        })
        .expect(HttpStatus.OK);
    });

    it('should confirm password', async function () {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(HttpStatus.OK);

      //if already confirmed should throw exception
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(HttpStatus.OK);
    });

    it('should not confirm if code is expired', async function () {
      const createdUser = await authHelper.createUser(userMock2);
      emailConfirmCode = await authHelper.createConfirmCode(createdUser, 0.1);
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(HttpStatus.OK);
    });
  });

  describe('POST:[HOST]/auth/login - login', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });

    it('should not login if login payload is invalid', async function () {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'gmai.com',
          password: '132',
        })
        .expect(HttpStatus.OK);
    });

    it('should not login if user is not confirmed', async function () {
      await authHelper.createUser(userMock, false);

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock.email,
          password: userMock.password,
        })
        .expect(HttpStatus.OK);
    });

    it('should login', async function () {
      await authHelper.createUser(userMock2, true);

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock2.email,
          password: userMock2.password,
        })
        .set('user-agent', 'test')
        .expect(200);
      expect(res.body.accessToken).toBeDefined();
    });
  });

  describe('POST:[HOST]/auth/new-password - set new password', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      users = await userTestHelper.createUsers(3);
      await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: users[2].email,
        })
        .expect(HttpStatus.OK);
    });
    it('POST:[HOST]/auth/new-password: should return code 400 If the inputModel has incorrect value (for incorrect password length) ', async () => {
      const recoveryCode = await dbTestHelper.getPasswordRecoveryCode(
        users[2].id,
      );
      await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          newPassword: 'st',
          recoveryCode,
        })
        .expect(HttpStatus.OK);
    });
    it('POST:[HOST]/auth/new-password: should return code 400 If  RecoveryCode is incorrect', async () => {
      await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          newPassword: 'string',
          recoveryCode: crypto.webcrypto.randomUUID(),
        })
        .expect(HttpStatus.OK);
    });
    it('POST:[HOST]/auth/new-password: should return code 204 If code is valid and new password is accepted', async () => {
      const recoveryCode = await dbTestHelper.getPasswordRecoveryCode(
        users[2]?.id,
      );
      await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          newPassword: 'newPassword_1',
          recoveryCode,
        })
        .expect(HttpStatus.OK);
    });

    it('should login', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: users[2].email,
          password: 'newPassword_1',
        })
        .set('user-agent', 'test')
        .expect(HttpStatus.OK);
      expect(res.body.accessToken).toBeDefined();
    });
  });

  describe('POST:[HOST]/auth/logout - logout from system', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });
    it('should not logout if cookie did`t pass', async function () {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(HttpStatus.OK);
    });

    it('should not logout if token expired', async () => {
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', `refreshToken=${mockToken.expired}`)
        .expect(HttpStatus.OK);
    });

    it('should success logout', async function () {
      await authHelper.createUser(userMock, true);
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock.email,
          password: userMock.password,
        })
        .expect(HttpStatus.OK);

      const token = res.get('Set-Cookie');
      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', token)
        .expect(HttpStatus.OK);
    });
  });

  describe('POST:[HOST]/auth/refresh-token - refreshing token', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });
    it('should not refresh if cookie did`t pass', async function () {
      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .expect(HttpStatus.OK);
    });

    it('should not refresh if token expired', async function () {
      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', `refreshToken=${mockToken.expired}`)
        .expect(HttpStatus.OK);
    });

    it('should not refresh if user inside token does not exist', async function () {
      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', `refreshToken=${mockToken.withNotExistingUser}`)
        .expect(HttpStatus.OK);
    });

    it('should refresh pair of tokens', async function () {
      await authHelper.createUser(userMock2, true);
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock2.email,
          password: userMock2.password,
        })
        .expect(HttpStatus.OK);

      const token = res.get('Set-Cookie');

      const resBody = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', token)
        .expect(HttpStatus.OK);

      expect(resBody.body.accessToken).toBeDefined();

      setTimeout(async () => {
        await request(app.getHttpServer())
          .post('/auth/refresh-token')
          .set('Cookie', token)
          .expect(HttpStatus.UNAUTHORIZED);
      }, 1);
      //if try with old tokens
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
