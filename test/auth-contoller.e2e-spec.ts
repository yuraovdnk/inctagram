import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getApp } from './test-utils';
import { DbTestHelper } from './test-helpers/db-test-helper';
import { UserTestHelper } from './test-helpers/user.test.helper';
import { User } from '@prisma/client';
import * as crypto from 'crypto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  const userTestHelper = new UserTestHelper();
  let users: User[];

  beforeAll(async () => {
    app = await getApp();
    await dbTestHelper.clearDb();
    users = await userTestHelper.createUsers(5);
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

  //new password
  it('POST:[HOST]/auth/new-password: should return code 400 If the inputModel is incorrect', async () => {
    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({
        newPassword: 'string',
      })
      .expect(400);
  });
  it('POST:[HOST]/auth/new-password: should return code 400 If the inputModel has incorrect value (for incorrect password length) ', async () => {
    const recoveryCode = await dbTestHelper.getPasswordRecoveryCode(
      users[0].id,
    );
    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({
        newPassword: 'st',
        recoveryCode,
      })
      .expect(400);
  });
  it('POST:[HOST]/auth/new-password: should return code 400 If  RecoveryCode is incorrect', async () => {
    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({
        newPassword: 'string',
        recoveryCode: crypto.webcrypto.randomUUID(),
      })
      .expect(400);
  });
  it('POST:[HOST]/auth/new-password: should return code 204 If code is valid and new password is accepted', async () => {
    const recoveryCode = await dbTestHelper.getPasswordRecoveryCode(
      users[0].id,
    );
    await request(app.getHttpServer())
      .post('/auth/new-password')
      .send({
        newPassword: 'newPassword',
        recoveryCode,
      })
      .expect(204);
  });
  // it('POST:[HOST]/auth/login: should return code 200 when user login with new password', async () => {
  //   await delay(10000);
  //
  //   await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: 'user1',
  //       password: 'newPassword',
  //     })
  //     .expect(200);
  // });
  // it('POST:[HOST]/auth/login: should return code 401 when user login with old password', async () => {
  //   const result = await request(app.getHttpServer())
  //     .post('/auth/login')
  //     .send({
  //       loginOrEmail: 'user1',
  //       password: 'password1',
  //     })
  //     .expect(401);
  // });
});
