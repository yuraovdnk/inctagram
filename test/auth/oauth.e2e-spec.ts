import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { AppModule } from '../../src/app.module';
import { INestApplication } from '@nestjs/common';
import { setupApp } from '../../src/main';
import { DbTestHelper } from '../test-helpers/db-test-helper';
import { GoogleGuard } from '../../src/modules/auth/application/strategies/google.strategy';
import { OauthExternalAccountDto } from '../../src/modules/auth/application/dto/request/oauth-external-account.dto';
import { GithubGuard } from '../../src/modules/auth/application/strategies/github.strategy';
import { emailServiceMock, eventBusMock, userMock } from '../mocks/mocks';
import { UserEntity } from '../../src/modules/users/domain/entity/user.entity';
import request from 'supertest';
import { EventBus } from '@nestjs/cqrs';
import { EmailService } from '../../src/core/adapters/mailer/mail.service';

describe('oauth', () => {
  jest.setTimeout(20000);
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let googleGuard: GoogleGuard;
  let githubGuard: GithubGuard;
  let usersRepository: UsersRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    app = module.createNestApplication();
    setupApp(app);
    await app.init();
    await dbTestHelper.clearDb();
    googleGuard = app.get(GoogleGuard);
    githubGuard = app.get(GithubGuard);
    usersRepository = app.get(UsersRepository);
  });

  function mockGuard(
    guard: GoogleGuard | GithubGuard,
    mockExternalAccountDto: OauthExternalAccountDto,
  ) {
    jest.spyOn(guard, 'canActivate').mockImplementation((args) => {
      const req = args.switchToHttp().getRequest();
      req.user = mockExternalAccountDto;
      return true;
    });
  }
  describe('authorization via external accounts', () => {
    const mockExternalAccount = new OauthExternalAccountDto(
      'google',
      '3423423',
      'yurii',
      'yuriiovdnk@gmail.com',
      'yuraovdnk',
    );

    it('registration via github', async () => {
      mockGuard(googleGuard, mockExternalAccount);

      const res = await request(app.getHttpServer()).get(
        '/oauth/google/callback',
      );

      expect(res.body).toHaveProperty('accessToken');

      const user = await usersRepository.findUserByProviderId(
        mockExternalAccount.providerId,
      );

      expect(user).toMatchObject<Partial<UserEntity>>({
        email: mockExternalAccount.email,
        externalAccounts: expect.arrayContaining([
          expect.objectContaining({
            providerId: mockExternalAccount.providerId,
            userId: user.id,
          }),
        ]),
      } as UserEntity);

      const lettersOnly = user.username.replace(/[^A-Za-z]/g, '');
      expect(lettersOnly).toEqual('Yuraovdnk');
      const numbersOnly = user.username.replace(/\D/g, '');
      expect(numbersOnly.length).toEqual(2);
    });

    it('should add opportunity login from external accounts to existing user', async function () {
      await dbTestHelper.clearDb();
      const userEntity = UserEntity.create(
        userMock.username,
        userMock.email,
        userMock.password,
      );

      await usersRepository.create(userEntity);

      const mockGithubAccount = new OauthExternalAccountDto(
        'github',
        '3242352551',
        'yurii',
        userMock.email,
        userMock.username,
      );
      mockGuard(githubGuard, mockGithubAccount);

      const mockGoogleAccount = new OauthExternalAccountDto(
        'google',
        '2532354235',
        'yurii',
        userMock.email,
        userMock.username,
      );
      mockGuard(googleGuard, mockGoogleAccount);

      //callback from google
      await request(app.getHttpServer()).get('/oauth/google/callback');

      const userByGoogleAcc = await usersRepository.findUserByProviderId(
        mockGoogleAccount.providerId,
      );

      expect(userByGoogleAcc).toMatchObject<Partial<UserEntity>>({
        email: mockGoogleAccount.email,
        externalAccounts: expect.arrayContaining([
          expect.objectContaining({
            providerId: mockGoogleAccount.providerId,
            userId: userByGoogleAcc.id,
          }),
        ]),
      } as UserEntity);

      //callback from google
      await request(app.getHttpServer()).get('/oauth/github/callback');
      const userByGithubAcc = await usersRepository.findUserByProviderId(
        mockGithubAccount.providerId,
      );

      expect(userByGithubAcc).toMatchObject<Partial<UserEntity>>({
        email: mockGithubAccount.email,
        externalAccounts: expect.arrayContaining([
          expect.objectContaining({
            providerId: mockGithubAccount.providerId,
            userId: userByGithubAcc.id,
          }),
        ]),
      } as UserEntity);

      expect(userByGithubAcc.externalAccounts.length).toBe(2);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
