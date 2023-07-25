import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getApp } from './test-utils';
import { DbTestHelper } from './test-helpers/db-test-helper';
import { UserTestHelper } from './test-helpers/user.test.helper';
import { User } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  const userTestHelper = new UserTestHelper();
  let users: User[];

  beforeAll(async () => {
    app = await getApp();
    await dbTestHelper.clearDb();
    users = await userTestHelper.createUsers(5);
    console.log(users);
  });
  afterAll(async () => {
    await app.close();
  });
  //registration

  //password recovery
  it('POST:[HOST]/auth/password-recovery: should return code 400 If email is incorrect', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: 'fake^^gmail.com',
      })
      .expect(HttpStatus.BAD_REQUEST);
  });
  it('POST:[HOST]/auth/password-recovery: should return code 204 If the email is correct', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: users[0].email,
      })
      .expect(HttpStatus.NO_CONTENT);
  });
  it('POST:[HOST]/auth/password-recovery: should return code 204 If the email is correct but email is not in dataBase', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: 'email1111@gmail.com',
      })
      .expect(HttpStatus.NO_CONTENT);
  });
  it('POST:[HOST]/auth/password-recovery: should return code 429 If More than 5 attempts from one IP-address during 10 seconds', async () => {
    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: 'email1111@gmail.com',
      })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: 'email1111@gmail.com',
      })
      .expect(HttpStatus.NO_CONTENT);

    await request(app.getHttpServer())
      .post('/auth/password-recovery')
      .send({
        email: 'email1111@gmail.com',
      })
      .expect(HttpStatus.TOO_MANY_REQUESTS);
  });
});
