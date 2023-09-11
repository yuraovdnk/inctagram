import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DbTestHelper } from '../test-helpers/db-test-helper';
import { ExtendedUser, UserTestHelper } from '../test-helpers/user.test.helper';
import { createUserProfileDtoMock } from '../mocks/mocks';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { AuthTestHelper } from '../test-helpers/auth-test.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { NotificationResult } from '../../src/core/common/notification/notification-result';
import { NotificationCodesEnum } from '../../src/core/common/notification/notification-codes.enum';
import { EmailService } from '../../src/core/adapters/mailer/mail.service';
import { setupApp } from '../../src/setup-app';

describe('UserController (e2e)', () => {
  jest.setTimeout(20000);
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let users: ExtendedUser[];
  let usersRepository: UsersRepository;
  let userTestHelper: UserTestHelper;
  let authHelper: AuthTestHelper;
  let emailService: EmailService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider(EventBus)
      // .useValue({
      //   register: jest.fn(),
      //   registerSagas: jest.fn(),
      //   publish: jest.fn(),
      // })
      .compile();

    app = moduleFixture.createNestApplication();
    app = setupApp(app);
    await app.init();
    await dbTestHelper.clearDb();
    usersRepository = app.get(UsersRepository);
    authHelper = new AuthTestHelper(app);
    userTestHelper = new UserTestHelper(app);
    // emailService = app.get(EmailService);
    // jest.spyOn(emailService, 'sendConfirmCode').mockImplementation();
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
  describe('[HOST]/user/profile - user profile', () => {
    let accessTokenUser: string;
    beforeAll(async () => {
      await dbTestHelper.clearDb();
    });
    it('prepare user', async () => {
      users = await userTestHelper.createUsers(1);
      const result = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: users[0]?.email,
          password: users[0]?.password,
        })
        .set('user-agent', 'test')
        .expect(HttpStatus.OK);
      accessTokenUser = result.body.data.accessToken;
    });
    //Create user profile
    it('POST:[HOST]/users/profile/:id should return noAuthorized error.', async () => {
      const result = await request(app.getHttpServer())
        .post(`/users/profile/${users[0].id}`)
        .expect(HttpStatus.OK);

      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('POST:[HOST]/users/profile/:id should return code 200 and users data.', async () => {
      const result = await request(app.getHttpServer())
        .post(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .send(createUserProfileDtoMock)
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.OK);
    });

    //Get user profile
    it('GET:[HOST]/users/profile/:id should return noAuthorized error.', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/profile/${users[0].id}`)
        .expect(HttpStatus.OK);

      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('GET:[HOST]/users/profile/:id should return code 200 and users data.', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.OK);
      expect(result.body.data).toEqual({
        userId: users[0].id,
        username: createUserProfileDtoMock.username,
        aboutMe: createUserProfileDtoMock.aboutMe,
        city: createUserProfileDtoMock.city,
        avatar: createUserProfileDtoMock.avatar,
        dateOfBirth: createUserProfileDtoMock.dateOfBirth,
        firstName: createUserProfileDtoMock.firstName,
        lastName: createUserProfileDtoMock.lastName,
      });
    });

    //Update user profile
    it('PUT:[HOST]/users/profile/:id should return noAuthorized error.', async () => {
      const result = await request(app.getHttpServer())
        .put(`/users/profile/${users[0].id}`)
        .expect(HttpStatus.OK);

      expectNotification(result, NotificationCodesEnum.UNAUTHORIZED);
    });

    it('PUT:[HOST]/users/profile/:id should update user profile', async () => {
      const updateUserProfileDtoMock = { ...createUserProfileDtoMock };
      updateUserProfileDtoMock.city = null;
      updateUserProfileDtoMock.aboutMe = null;
      updateUserProfileDtoMock.avatar = null;

      const result = await request(app.getHttpServer())
        .put(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .send(updateUserProfileDtoMock)
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.OK);

      const result1 = await request(app.getHttpServer())
        .get(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .expect(HttpStatus.OK);
      expectNotification(result1, NotificationCodesEnum.OK);
      expect(result1.body.data).toEqual({
        userId: users[0].id,
        username: updateUserProfileDtoMock.username,
        aboutMe: null,
        city: null,
        avatar: null,
        dateOfBirth: updateUserProfileDtoMock.dateOfBirth,
        firstName: updateUserProfileDtoMock.firstName,
        lastName: updateUserProfileDtoMock.lastName,
      });
    });

    it('PUT:[HOST]/users/profile/:id should update username', async () => {
      const updateUserProfileDtoMock = { ...createUserProfileDtoMock };
      updateUserProfileDtoMock.username = 'NewUsername';

      const result = await request(app.getHttpServer())
        .put(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .send(updateUserProfileDtoMock)
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.OK);

      const result1 = await request(app.getHttpServer())
        .get(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .expect(HttpStatus.OK);
      expectNotification(result1, NotificationCodesEnum.OK);
      expect(result1.body.data.username).toBe(
        updateUserProfileDtoMock.username,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
