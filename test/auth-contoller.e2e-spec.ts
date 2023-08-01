import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { getApp } from './test-utils';
import { DbTestHelper } from './test-helpers/db-test-helper';
import { UserTestHelper } from './test-helpers/user.test.helper';
import { User } from '@prisma/client';
import { userMock, userMock2 } from './mocks/user-mock';
import { UsersRepository } from '../src/modules/users/instrastructure/repository/users.repository';
import { AuthTestHelper } from './test-helpers/auth-test.helper';
import { EmailConfirmationEntity } from '../src/modules/auth/domain/entity/email-confirmation.entity';
import { AuthRepository } from '../src/modules/auth/infrastructure/repository/auth.repository';
import { EmailService } from '../src/core/adapters/mailer/mail.service';
import { v4 as uuid } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { EmailConfirmCommand } from '../src/modules/auth/application/use-cases/command/email-confirm.command.handler';
import * as crypto from 'crypto';

jest.setTimeout(20000);
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  const userTestHelper = new UserTestHelper();
  let users: User[];
  let usersRepository: UsersRepository;
  let authRepository: AuthRepository;
  let authHelper: AuthTestHelper;
  let emailService: EmailService;
  let commandBus: CommandBus;

  beforeAll(async () => {
    app = await getApp();
    await dbTestHelper.clearDb();
    users = await userTestHelper.createUsers(5);
    usersRepository = app.get(UsersRepository);
    authRepository = app.get(AuthRepository);
    emailService = app.get(EmailService);
    commandBus = app.get(CommandBus);
    authHelper = new AuthTestHelper(app);
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

  describe('POST:[HOST]/auth/signup - registration', () => {
    it('should not register', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'moockusername',
          email: 'email',
          password: '123456',
          passwordConfirm: '123456',
        })
        .expect(400);

      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          username: 'moockusername',
          email: 'email@gmail.com',
          password: '123456',
          passwordConfirm: '1234566',
        })
        .expect(400);
    });
    it('should register user', async function () {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userMock)
        .expect(204);

      //if already registered
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userMock)
        .expect(400);

      //user should be not confirmed
      const user = await usersRepository.findByEmail(userMock.email);
      expect(user.isConfirmedEmail).toBeFalsy();
    });
  });

  describe('POST:[HOST]/auth/registration-confirmation - confirmation email', () => {
    let emailConfirmCode: EmailConfirmationEntity;
    beforeAll(async () => {
      const createdUser = await authHelper.createUser(userMock);
      emailConfirmCode = await authHelper.createConfirmCode(createdUser, 15);
    });
    it('should not confirm if code is incorrect', async function () {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: uuid(),
        })
        .expect(400);
    });

    it('should not confirm if input code value is incorrect ', async function () {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: '2fdg342',
        })
        .expect(400);
    });

    it('should confirm password', async function () {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(204);

      //if already confirmed should throw exception
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(400);
    });

    it('should not confirm if code is expired', async function () {
      const createdUser = await authHelper.createUser(userMock2);
      emailConfirmCode = await authHelper.createConfirmCode(createdUser, 0.1);
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({
          code: emailConfirmCode.code,
        })
        .expect(400);
    });
  });
  describe('POST:[HOST]/auth/login - login', () => {
    it('should not login if login payload is invalid', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'gmai.com',
          password: '132',
        })
        .expect(400);
    });
    it('should not login if login payload is invalid', async function () {
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'gmai.com',
          password: '132',
        })
        .expect(400);
    });

    it('should not login if user is not confirmed', async function () {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(userMock)
        .expect(204);

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock.email,
          password: userMock.password,
        })
        .expect(400);
    });
    it('should login', async function () {
      const createdUser = await authHelper.createUser(userMock2);
      const emailConfirmCode = await authHelper.createConfirmCode(
        createdUser,
        15,
      );
      await commandBus.execute(new EmailConfirmCommand(emailConfirmCode.code));

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: userMock2.email,
          password: userMock2.password,
        })
        .set('user-agent', 'test');

      expect(res.body.accessToken).toBeDefined();
    });
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
