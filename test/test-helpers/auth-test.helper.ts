import { INestApplication } from '@nestjs/common';
import { IUserMock } from '../mocks/mocks';
import { UsersRepository } from '../../src/modules/users/instrastructure/repository/users.repository';
import { UserEntity } from '../../src/modules/users/domain/entity/user.entity';
import { add } from 'date-fns';
import { EmailConfirmationEntity } from '../../src/modules/auth/domain/entity/email-confirmation.entity';
import { AuthRepository } from '../../src/modules/auth/infrastructure/repository/auth.repository';
import { EmailService } from '../../src/core/adapters/mailer/mail.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import request from 'supertest';
import { SignUpDto } from '../../src/modules/auth/application/dto/request/sign-up.dto';
import { NotificationResult } from '../../src/core/common/notification/notification-result';

export class AuthTestHelper {
  private usersRepository: UsersRepository;
  private authRepository: AuthRepository;
  private emailService: EmailService;
  constructor(private app: INestApplication) {
    this.usersRepository = app.get(UsersRepository);
    this.authRepository = app.get(AuthRepository);
    this.emailService = app.get(EmailService);
  }

  async signUp(singUpDto: SignUpDto, expect: number) {
    await request(this.app.getHttpServer())
      .post('/auth/signup')
      .send(singUpDto)
      .expect(expect);
  }
  async createUser(
    mockUser: IUserMock,
    confirmStatus = false,
  ): Promise<UserEntity> {
    const passwordHash = bcrypt.hashSync(mockUser.password, 10);

    const userEntity = UserEntity.create(
      mockUser.username,
      mockUser.email,
      passwordHash,
    );

    userEntity.isConfirmedEmail = confirmStatus; //for tests to don`t confirm every time
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

    const mockSuccessNotification: NotificationResult<EmailConfirmationEntity> =
      {
        data: mockEmailConfirmEntity,
        resultCode: 0,
        extensions: [],
        hasError(): boolean {
          return false;
        },
      };

    jest
      .spyOn(EmailConfirmationEntity, 'create')
      .mockImplementation(() => mockSuccessNotification);

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
