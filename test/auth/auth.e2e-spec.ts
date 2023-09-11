import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DbTestHelper } from '../test-helpers/db-test-helper';
import { ExtendedUser, UserTestHelper } from '../test-helpers/user.test.helper';
import {
  emailServiceMock,
  eventBusMock,
  mockToken,
  userMock,
  userMock2,
} from '../mocks/mocks';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { AuthTestHelper } from '../test-helpers/auth-test.helper';
import { setupApp } from '../../src/main';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { NotificationResult } from '../../src/core/common/notification/notification-result';
import { NotificationCodesEnum } from '../../src/core/common/notification/notification-codes.enum';
import { EmailService } from '../../src/core/adapters/mailer/mail.service';
import { EventBus } from '@nestjs/cqrs';
import { EmailConfirmationEntity } from '../../src/modules/auth/domain/entity/email-confirmation.entity';
import crypto from 'crypto';
import { GoogleGuard } from '../../src/modules/auth/application/strategies/google.strategy';
import { GithubGuard } from '../../src/modules/auth/application/strategies/github.strategy';

describe('AuthController (e2e)', () => {
  jest.setTimeout(20000);
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let users: ExtendedUser[];
  let usersRepository: UsersRepository;
  let userTestHelper: UserTestHelper;
  let authHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(EmailService)
      .useValue(emailServiceMock)
      .overrideProvider(GoogleGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(GithubGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app = setupApp(app);
    await app.init();
    await dbTestHelper.clearDb();
    usersRepository = app.get(UsersRepository);
    authHelper = new AuthTestHelper(app);
    userTestHelper = new UserTestHelper(app);
  });

  function expectNotification(
    result: request.Response,
    resultCode: NotificationCodesEnum,
  ) {
    expect(result.body).toMatchObject<Partial<NotificationResult>>({
      resultCode,
    });
  }

  //////////////////////////////
  describe('GET:[HOST]/auth/me - get user info', () => {
    let accessTokenUser: string;
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      users = await userTestHelper.createUsers(1);
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: users[0]?.email,
          password: users[0]?.password,
        })
        .set('user-agent', 'test')
        .expect(HttpStatus.OK);

      expect(result.body).toMatchObject({
        data: {
          accessToken: expect.any(String),
        },
      });

      accessTokenUser = result.body.data.accessToken;
    });
    it('POST:[HOST]/auth/me: should return noAuthorized error.', async () => {
      const result = await request(app.getHttpServer())
        .get('/auth/me')
        .expect(HttpStatus.OK);

      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });
    it('POST:[HOST]/auth/me: should return code 200 and users data.', async () => {
      const result = await request(app.getHttpServer())
        .get('/auth/me')
        .auth(accessTokenUser, { type: 'bearer' })
        .expect(HttpStatus.OK);
      expect(result.body.resultCode).toBe(0);
      expect(result.body.data).toEqual({
        username: users[0]?.username,
        email: users[0]?.email,
        userId: users[0]?.id,
      });
    });
  });
  ////////////////////////////////
  describe('POST:[HOST]/auth/password-recovery', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      users = await userTestHelper.createUsers(1);
    });

    it('POST:[HOST]/auth/password-recovery: should return NotificationCode 2 If email is incorrect', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: 'fake^^gmail.com',
        })
        .expect(HttpStatus.OK);
      expect(body).toEqual({
        extensions: [
          {
            message: expect.any(String),
            key: 'email',
          },
        ],
        data: null,
        resultCode: 2,
      });
    });
    it('POST:[HOST]/auth/password-recovery: should return NotificationCode 0 If the email is correct', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: users[0].email,
        })
        .expect(HttpStatus.OK);
      expect(body).toEqual({
        extensions: [],
        data: null,
        resultCode: 0,
      });
    });
    it('POST:[HOST]/auth/password-recovery: should return code 204 If the email is correct but email is not in dataBase', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({
          email: 'email1111@gmail.com',
        })
        .expect(HttpStatus.OK);
      expect(body.resultCode).toBe(0);
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
  //////////////////////////////
  describe('POST:[HOST]/auth/signup - registration', () => {
    it('should not register if username is incorrect', async () => {
      const result1 = await authHelper.signUp(
        {
          username: 'testusername',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
      expectNotification(result1, NotificationCodesEnum.BAD_REQUEST);

      const result2 = await authHelper.signUp(
        {
          username: 'test',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
      expectNotification(result2, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not register if email is incorrect ', async function () {
      const result1 = await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
      expectNotification(result1, NotificationCodesEnum.BAD_REQUEST);

      const result2 = await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'ema@gmail.com',
          password: '123456',
          passwordConfirm: '123456',
        },
        HttpStatus.OK,
      );
      expectNotification(result2, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not register if password is incorrect ', async function () {
      const result = await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email@gmail.com',
          password: 'password',
          passwordConfirm: 'password',
        },
        HttpStatus.OK,
      );
      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not register if confirm password not equal password', async function () {
      const result = await authHelper.signUp(
        {
          username: 'Testuser123',
          email: 'email@gmail.com',
          password: 'password',
          passwordConfirm: 'StrongPassword@',
        },
        HttpStatus.OK,
      );
      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should register user with correct data', async function () {
      const res = await authHelper.signUp(userMock, HttpStatus.OK);
      expectNotification(res, NotificationCodesEnum.OK);
      expect((res.body as NotificationResult).data).toEqual({
        email: userMock.email,
      });
    });

    it('should register user', async function () {
      await dbTestHelper.clearDb();
      const result1 = await authHelper.signUp(userMock, HttpStatus.OK);
      expectNotification(result1, NotificationCodesEnum.OK);

      //if already registered
      const result2 = await authHelper.signUp(userMock, HttpStatus.OK);
      expectNotification(result2, NotificationCodesEnum.BAD_REQUEST);

      //user should be not confirmed
      const user = await usersRepository.findByEmail(userMock.email);
      expect(user.isConfirmedEmail).toBeFalsy();
    });
  });
  //////////////////////////////
  describe('POST:[HOST]/auth/registration-confirmation - confirmation email', () => {
    let emailConfirmCode: EmailConfirmationEntity;

    beforeAll(async () => {
      await dbTestHelper.clearDb();
      const createdUser = await authHelper.createUser(userMock);
      emailConfirmCode = await authHelper.createConfirmCode(createdUser, 15);
    });
    it('should not confirm if code is incorrect', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: crypto.webcrypto.randomUUID(),
        })
        .expect(HttpStatus.OK);
      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not confirm if input code value is incorrect ', async function () {
      const result = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: '2fdg342',
        })
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should confirm password', async function () {
      const result1 = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(HttpStatus.OK);
      expectNotification(result1, NotificationCodesEnum.OK);

      //if already user is confirmed
      const result2 = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(HttpStatus.OK);
      expectNotification(result2, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not confirm if code is expired', async function () {
      await dbTestHelper.clearDb();
      const createdUser = await authHelper.createUser(userMock);
      emailConfirmCode = await authHelper.createConfirmCode(createdUser, 0.1);

      const result = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });
  });
  //////////////////////////////
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
    it('POST:[HOST]/auth/new-password: should return NotificationResult (Code 2) if new password is too short', async () => {
      const recoveryCode = await dbTestHelper.getPasswordRecoveryCode(
        users[2].id,
      );
      const { body } = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          newPassword: 'st',
          recoveryCode,
        })
        .expect(HttpStatus.OK);
      expect(body).toEqual({
        extensions: [
          {
            message: expect.any(String),
            key: 'newPassword',
          },
        ],
        data: null,
        resultCode: 2,
      });
    });
    it('POST:[HOST]/auth/new-password: should return NotificationResult (Code 2) If  RecoveryCode is incorrect', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          newPassword: 'string',
          recoveryCode: crypto.webcrypto.randomUUID(),
        })
        .expect(HttpStatus.OK);
      expect(body.resultCode).toBe(2);
    });
    it('POST:[HOST]/auth/new-password: should return NotificationResult (Code 0) If code is valid and new password is accepted', async () => {
      const recoveryCode = await dbTestHelper.getPasswordRecoveryCode(
        users[2]?.id,
      );
      const { body } = await request(app.getHttpServer())
        .post('/auth/new-password')
        .send({
          newPassword: 'newPassword_1',
          recoveryCode,
        })
        .expect(HttpStatus.OK);
      expect(body.resultCode).toBe(0);
    });
    it('should login', async function () {
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: users[2].email,
          password: 'newPassword_1',
        })
        .set('user-agent', 'test')
        .expect(HttpStatus.OK);

      expect(result.body).toMatchObject({
        data: {
          accessToken: expect.any(String),
        },
      });
    });
  });
  ////////////////////////////////
  describe('POST:[HOST]/auth/login - login', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });

    it('should not login if login payload is invalid', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'gmai.com',
          password: '132',
        })
        .expect(HttpStatus.OK);
      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not login if user is not confirmed', async function () {
      await authHelper.createUser(userMock, false);

      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock.email,
          password: userMock.password,
        })
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('should login', async function () {
      await authHelper.createUser(userMock2, true);

      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock2.email,
          password: userMock2.password,
        })
        .set('user-agent', 'test')
        .expect(200);

      expect(result.body).toMatchObject({
        data: {
          accessToken: expect.any(String),
        },
      });
    });
  });
  ////////////////////////////////
  describe('POST:[HOST]/auth/logout - logout from system', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });

    it('should not logout if cookie did`t pass', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .expect(HttpStatus.OK);
      expectNotification(res, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('should not logout if token expired', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', `refreshToken=${mockToken.expired}`)
        .expect(HttpStatus.OK);
      expectNotification(res, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('should success logout', async function () {
      await authHelper.createUser(userMock, true);
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock.email,
          password: userMock.password,
        })
        .expect(HttpStatus.OK);

      const token = result.get('Set-Cookie');
      const result2 = await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', token)
        .expect(HttpStatus.OK);
      console.log(result.body, 'resultBody');
      expectNotification(result2, NotificationCodesEnum.OK);
    });
  });
  ////////////////////////////////
  describe('POST:[HOST]/auth/refresh-token - refreshing token', () => {
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });
    it('should not refresh if cookie did`t pass', async function () {
      const result = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('should not refresh if token expired', async function () {
      const result = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', `refreshToken=${mockToken.expired}`)
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('should not refresh if user inside token does not exist', async function () {
      const result = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', `refreshToken=${mockToken.withNotExistingUser}`)
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('should refresh pair of tokens', async function () {
      await authHelper.createUser(userMock2, true);
      const result1 = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock2.email,
          password: userMock2.password,
        })
        .expect(HttpStatus.OK);

      const token = result1.get('Set-Cookie');

      const result2 = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', token)
        .expect(HttpStatus.OK);

      expect(result2.body).toMatchObject({
        data: {
          accessToken: expect.any(String),
        },
      });

      //if try with old tokens
      const res = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Cookie', token)
        .expect(HttpStatus.OK);
    });
  });
  ////////////////////////////////
  describe('POST:[HOST]/auth/registration-email-resending - registration-email-resending', () => {
    it('should return bad result if email is incorrect', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({
          email: 'dsfsd-gmai.com',
        });
      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should return bad result if email is incorrect', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({
          email: 'dsfsd-gmai.com',
        });

      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should return success if user is not exist', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({
          email: 'dsfsd@gmai.com',
        });
      expectNotification(res, NotificationCodesEnum.OK);
    });

    it('should return forbidden result if user is already confirmed', async function () {
      await authHelper.createUser(userMock, true);
      const res = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({
          email: userMock.email,
        });
      expectNotification(res, NotificationCodesEnum.FORBIDDEN);
    });

    it('should return success result', async function () {
      await dbTestHelper.clearDb();
      const createdUser = await authHelper.createUser(userMock, false);
      const emailConfirmationEntity = await authHelper.createConfirmCode(
        createdUser,
        15,
      );
      const result = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmationEntity.code,
        })
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.OK);
    });
  });
  ////////////////////////////////

  afterAll(async () => {
    await app.close();
  });
});
