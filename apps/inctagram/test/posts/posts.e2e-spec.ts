import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../../src/setup-app';
import request from 'supertest';
import { DbTestHelper } from '../test-helpers/db-test-helper';
import { ExtendedUser, UserTestHelper } from '../test-helpers/user.test.helper';
import { AuthTestHelper } from '../test-helpers/auth-test.helper';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { FilesServiceFacade } from '../../src/clients/files-ms/files-service.fasade';
import { NotificationResult } from '../../../../libs/common/notification/notification-result';
import { NotificationCodesEnum } from '../../../../libs/common/notification/notification-codes.enum';
import crypto from 'crypto';
import { FilesServiceFacadeMock } from '../mocks/files-service.facade.mock';
import { PageDto } from '../../../../libs/common/dtos/pagination.dto';
import { PostViewModel } from '../../src/modules/posts/application/dto/post.view-model';

describe('Posts', () => {
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let users: ExtendedUser[];
  let userTestHelper: UserTestHelper;
  let authHelper: AuthTestHelper;
  let userRepos: UsersRepository;
  let filesServiceFacade: FilesServiceFacade;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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
    userRepos = app.get(UsersRepository);
    filesServiceFacade = app.get(FilesServiceFacade);
  });
  function expectNotification(
    result: request.Response,
    resultCode: NotificationCodesEnum,
  ) {
    expect(result.body).toMatchObject<Partial<NotificationResult>>({
      resultCode,
    });
  }

  describe('POST - [HOST]/posts/create - create post with uploading files', () => {
    const userStub = {
      id: null,
      accessToken: null,
      email: null,
      password: null,
    };
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      const users = await userTestHelper.createUsers(1);
      userStub.email = users[0].email;
      userStub.password = users[0].password;

      userStub.accessToken = await authHelper.login(
        userStub.email,
        userStub.password,
      );
      const user = await userRepos.findByEmail(userStub.email);
      userStub.id = user.id;
      await userTestHelper.createProfile(userStub.id, userStub.accessToken);
    });
    it('should not create post if description length is more than acceptable', async function () {
      const res = await request(app.getHttpServer())
        .post('/posts/create')
        .set('Content-Type', 'multipart/form-data')
        .field('description', 'test'.repeat(500))
        .auth(userStub.accessToken, { type: 'bearer' });
      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });
    it('should not create post if max size of uploaded files is more than acceptable  ', async function () {
      const res = await request(app.getHttpServer())
        .post('/posts/create')
        .set('Content-Type', 'multipart/form-data')
        .field('description', 'test'.repeat(100))
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .attach('images', Buffer.from('t'.repeat(100000), 'utf8'), 'test.jpeg')
        .auth(userStub.accessToken, { type: 'bearer' });

      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });
    it('should not create post if file size is more 20MB', async function () {
      const res = await request(app.getHttpServer())
        .post('/posts/create')
        .set('Content-Type', 'multipart/form-data')
        .field('description', 'test'.repeat(100))
        .attach(
          'images',
          Buffer.from('t'.repeat(100000000), 'utf8'),
          'test.jpeg',
        )
        .auth(userStub.accessToken, { type: 'bearer' });

      expectNotification(res, NotificationCodesEnum.BAD_REQUEST);
    });
    it('should create post and return success result', async function () {
      const res = await request(app.getHttpServer())
        .post('/posts/create')
        .set('Content-Type', 'multipart/form-data')
        .field('description', 'test'.repeat(100))
        .attach('images', Buffer.from('t'.repeat(10000), 'utf8'), 'test.jpeg')
        .auth(userStub.accessToken, { type: 'bearer' });

      expectNotification(res, NotificationCodesEnum.OK);
      expect(res.body.data);
    });
  });

  describe('GET - [HOST]/posts - get all users posts', () => {
    const userStub = {
      id: null,
      accessToken: null,
      email: null,
      password: null,
    };
    beforeAll(async () => {
      await dbTestHelper.clearDb();
      const users = await userTestHelper.createUsers(1);
      userStub.email = users[0].email;
      userStub.password = users[0].password;

      userStub.accessToken = await authHelper.login(
        userStub.email,
        userStub.password,
      );
      const user = await userRepos.findByEmail(userStub.email);
      userStub.id = user.id;
      await userTestHelper.createProfile(userStub.id, userStub.accessToken);
    });
    it('should return NOT_FOUND extension ', async function () {
      const result = await request(app.getHttpServer()).get(
        `/posts/${crypto.randomUUID()}`,
      );
      expectNotification(result, NotificationCodesEnum.NOT_FOUND);
    });

    it('should return posts', async function () {
      const countPosts = 3;
      const countPostImages = 2;

      for (let i = 0; i < countPosts; i++) {
        await userTestHelper.createPost(
          'test description',
          userStub.accessToken,
        );
      }

      jest
        .spyOn(filesServiceFacade.queries, 'getPostImages')
        .mockImplementation(() => {
          const images = [];
          for (let i = 0; i < countPostImages; i++) {
            images.push({
              id: `imageId${i}`,
              size: 5414,
              variant: 'medium',
              url: `https://s3.eu-central-1.amazonaws.com/example-bucket/avatar${i}.png`,
            });
          }

          return Promise.resolve(NotificationResult.Success(images));
        });

      const result = await request(app.getHttpServer()).get(
        `/posts/${userStub.id}`,
      );
      expectNotification(result, NotificationCodesEnum.OK);

      const resultNotificationData: PageDto<PostViewModel> = result.body.data;

      expect(resultNotificationData.totalCount).toBe(countPosts);

      resultNotificationData.items.forEach((i) => {
        expect(i.images.length).toBe(countPostImages);
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});
