import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { setupApp } from '../src/main';
import { UsersRepository } from '../src/modules/users/instrastructure/repository/users.repository';
import { INestApplication } from '@nestjs/common';
import { DbTestHelper } from './test-helpers/db-test-helper';
import { CommandBus } from '@nestjs/cqrs';
import { TestCaseCommand } from './test.case';
import { EmailService } from '../src/core/adapters/mailer/mail.service';
import { NotificationResult } from '../src/core/common/notification/notification-result';
import { UserEntity } from '../src/modules/users/domain/entity/user.entity';

describe('fgdfsfd', () => {
  let app: INestApplication;
  const dbTestHelper = new DbTestHelper();
  let usersRepository: UsersRepository;
  let commandBus: CommandBus;
  let emailService: EmailService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = setupApp(app);
    await app.init();

    await dbTestHelper.clearDb();
    usersRepository = app.get(UsersRepository);

    commandBus = app.get(CommandBus);
    emailService = app.get(EmailService);
  });

  it('should ', async function () {
    jest.spyOn(emailService, 'sendConfirmCode').mockImplementation();

    const result = await commandBus.execute<
      TestCaseCommand,
      NotificationResult<UserEntity>
    >(new TestCaseCommand());

    expect(emailService.sendConfirmCode).toHaveBeenCalledTimes(1);
    const user = usersRepository.findById(result.data.id);
    expect(user).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
