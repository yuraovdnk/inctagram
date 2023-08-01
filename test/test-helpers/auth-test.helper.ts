import { INestApplication } from '@nestjs/common';
import { IUserMock } from '../mocks/user-mock';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { UserEntity } from '../../src/modules/users/domain/entity/user.entity';
import { add } from 'date-fns';
import { EmailConfirmationEntity } from '../../src/modules/auth/domain/entity/email-confirmation.entity';
import { AuthRepository } from '../../src/modules/auth/infrastructure/repository/auth.repository';
import { EmailService } from '../../src/core/adapters/mailer/mail.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';

export class AuthTestHelper {
  private usersRepository: UsersRepository;
  private authRepository: AuthRepository;
  private emailService: EmailService;
  constructor(private app: INestApplication) {
    this.usersRepository = app.get(UsersRepository);
    this.authRepository = app.get(AuthRepository);
    this.emailService = app.get(EmailService);
  }

  async createUser(mockUser: IUserMock): Promise<UserEntity> {
    const passwordHash = bcrypt.hashSync(mockUser.password, 10);
    const userEntity = UserEntity.create(
      mockUser.username,
      mockUser.email,
      passwordHash,
    );
    await this.usersRepository.create(userEntity);
    return userEntity;
  }

  async createConfirmCode(
    userEntity: UserEntity,
    timeCode?: number,
  ): Promise<EmailConfirmationEntity> {
    jest.spyOn(this.emailService, 'sendConfirmCode').mockImplementation();

    const mockEmailConfirmEntity: EmailConfirmationEntity = {
      userId: userEntity.id,
      code: uuid(),
      expireAt: add(new Date(), { seconds: timeCode ?? 1 }),
      createdAt: undefined,
    };

    jest
      .spyOn(EmailConfirmationEntity, 'create')
      .mockImplementation(() => mockEmailConfirmEntity);

    await Promise.all([
      this.authRepository.createEmailConfirmCode(mockEmailConfirmEntity),
      this.emailService.sendConfirmCode(
        userEntity.username,
        userEntity.email,
        mockEmailConfirmEntity.code,
      ),
    ]);

    expect(this.emailService.sendConfirmCode).toHaveBeenCalled();
    return mockEmailConfirmEntity;
  }
}
