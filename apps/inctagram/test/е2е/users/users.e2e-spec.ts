import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DbTestHelper } from '../../test-helpers/db-test-helper';
import {
  ExtendedUser,
  UserTestHelper,
} from '../../test-helpers/user.test.helper';
import { createUserProfileDtoMock } from '../../mocks/mocks';
import { AuthTestHelper } from '../../test-helpers/auth-test.helper';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { NotificationResult } from '../../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../../libs/common/notification/notification-codes.enum';
import { setupApp } from '../../../src/setup-app';
import { AuthModule } from '../../../src/modules/auth/auth.module';
import { FilesServiceFacade } from '../../../src/clients/files-ms/files-service.fasade';
import { FilesServiceFacadeMock } from '../../mocks/files-service.facade.mock';

describe('UserController (e2e)', () => {
  jest.setTimeout(20000);
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let users: ExtendedUser[];
  let userTestHelper: UserTestHelper;
  let authHelper: AuthTestHelper;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    })
      .overrideProvider(FilesServiceFacade)
      .useValue(new FilesServiceFacadeMock())
      .compile();

    app = moduleFixture.createNestApplication();
    app = setupApp(app);
    await app.init();
    await dbTestHelper.clearDb();
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

      expectNotification(result, NotificationCodesEnum.OK);
    });

    it('GET:[HOST]/users/profile/:id should return code 200 and users data.', async () => {
      const result = await request(app.getHttpServer())
        .get(`/users/profile/${users[0].id}`)
        .auth(accessTokenUser, { type: 'bearer' })
        .expect(HttpStatus.OK);
      expectNotification(result, NotificationCodesEnum.OK);

      expect(result.body.data).toMatchObject({
        userId: users[0].id,
        username: createUserProfileDtoMock.username,
        aboutMe: createUserProfileDtoMock.aboutMe,
        city: createUserProfileDtoMock.city,
        avatar: null,
        country: createUserProfileDtoMock.country,
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
      updateUserProfileDtoMock.country = null;
      updateUserProfileDtoMock.aboutMe = null;

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
      expect(result1.body.data).toMatchObject({
        userId: users[0].id,
        username: updateUserProfileDtoMock.username,
        aboutMe: null,
        city: null,
        avatar: null,
        country: null,
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

  describe('[HOST]/user/profile - upload user profile avatar', () => {
    let userToken: string;
    let users;
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      users = await userTestHelper.createUsers(1);
      userToken = await authHelper.login(users[0].email, users[0].password);
    });

    it('should not upload if file size exceeds the allowed limit.', async function () {
      const result = await request(app.getHttpServer())
        .post('/users/profile/avatar/upload')
        .set('Content-Type', 'multipart/form-data')
        .auth(userToken, { type: 'bearer' })
        .attach('file', Buffer.from('t'.repeat(10485760), 'utf8'), 'test.jpeg')
        .expect(200);
      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not upload if file type is incorrect', async function () {
      const result = await request(app.getHttpServer())
        .post('/users/profile/avatar/upload')
        .set('Content-Type', 'multipart/form-data')
        .auth(userToken, { type: 'bearer' })
        .attach('file', Buffer.from('t'.repeat(10000), 'utf8'), 'test.svg')
        .expect(200);

      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should not upload if file didn`t pass', async function () {
      const result = await request(app.getHttpServer())
        .post('/users/profile/avatar/upload')
        .set('Content-Type', 'multipart/form-data')
        .auth(userToken, { type: 'bearer' })
        .expect(200);
      expectNotification(result, NotificationCodesEnum.BAD_REQUEST);
    });

    it('should success upload', async function () {
      //create profile
      const res = await request(app.getHttpServer())
        .post(`/users/profile/${users[0].id}`)
        .auth(userToken, { type: 'bearer' })
        .send(createUserProfileDtoMock)
        .expect(HttpStatus.OK);

      //upload profile avatar
      const result = await request(app.getHttpServer())
        .post('/users/profile/avatar/upload')
        .set('Content-Type', 'multipart/form-data')
        .attach('file', Buffer.from('t'.repeat(10000), 'utf8'), 'test.jpeg')
        .auth(userToken, { type: 'bearer' })
        .expect(200);

      expectNotification(result, NotificationCodesEnum.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
