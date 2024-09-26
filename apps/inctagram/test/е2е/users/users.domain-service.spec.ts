import { UsersRepository } from '../../../src/modules/users/instrastructure/repository/users.repository';
import { UserDomainService } from '../../../src/modules/users/domain/service/user.domain-service';
import { Test, TestingModule } from '@nestjs/testing';
import { OauthExternalAccountDto } from '../../../src/modules/auth/application/dto/request/oauth-external-account.dto';

///test
describe('UserDomainService', () => {
  let userDomainService: UserDomainService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDomainService,
        {
          provide: UsersRepository,
          useValue: {
            findByUsername: jest.fn(),
          },
        },
      ],
    }).compile();

    userDomainService = module.get<UserDomainService>(UserDomainService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('generateUsername', () => {
    let dto: OauthExternalAccountDto;
    beforeEach(() => {
      dto = new OauthExternalAccountDto(
        'google',
        '13432423',
        'Test',
        'testovyi@gmail.com',
        'albert',
      );
    });

    it('should generate a username based username of external account', async () => {
      usersRepository.findByUsername = jest.fn().mockResolvedValue(null);

      const generatedUsername = await userDomainService.generateUsername(dto);

      const lettersOnly = generatedUsername.replace(/[^A-Za-z]/g, '');
      expect(lettersOnly).toEqual('Albert');
      const numbersOnly = generatedUsername.replace(/\D/g, '');
      expect(numbersOnly.length).toEqual(2);
    });

    it('should generate a username based email of external account', async () => {
      dto.username = undefined;
      usersRepository.findByUsername = jest.fn().mockResolvedValue(null);

      const generatedUsername = await userDomainService.generateUsername(dto);

      const lettersOnly = generatedUsername.replace(/[^A-Za-z]/g, '');
      expect(lettersOnly).toEqual('Testovyi');
      const numbersOnly = generatedUsername.replace(/\D/g, '');
      expect(numbersOnly.length).toEqual(2);
    });

    it('should generate a unique username based username of externalAccount with additional round generating', async () => {
      usersRepository.findByUsername = jest
        .fn()
        .mockResolvedValueOnce(true)
        .mockResolvedValue(null);

      const generatedUsername = await userDomainService.generateUsername(dto);

      const lettersOnly = generatedUsername.replace(/[^A-Za-z]/g, '');
      expect(lettersOnly).toEqual('Albert');
      const numbersOnly = generatedUsername.replace(/\D/g, '');
      expect(numbersOnly.length).toEqual(3);
    });

    it('should generate a unique username based email of externalAccount with additional round generating', async () => {
      dto.username = undefined;

      usersRepository.findByUsername = jest
        .fn()
        .mockResolvedValueOnce(true) //Means that user with the username exists with given username
        .mockResolvedValue(null); //Means that user with the username does not exist

      const generatedUsername = await userDomainService.generateUsername(dto);

      const lettersOnly = generatedUsername.replace(/[^A-Za-z]/g, '');
      expect(lettersOnly).toEqual('Testovyi');
      const numbersOnly = generatedUsername.replace(/\D/g, '');
      expect(numbersOnly.length).toEqual(3);
    });
  });
});
