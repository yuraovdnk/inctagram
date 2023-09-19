import { Injectable } from '@nestjs/common';
import { OauthExternalAccountDto } from '../../../auth/application/dto/request/oauth-external-account.dto';
import { UsersRepository } from '../../instrastructure/repository/users.repository';

@Injectable()
export class UserDomainService {
  constructor(private usersRepository: UsersRepository) {}

  async generateUsername(dto: OauthExternalAccountDto) {
    let username = dto.username || dto.email.split('@')[0];

    //replace first letter to uppercase and add unique number with 2 length
    username =
      username.charAt(0).toUpperCase() +
      username.slice(1) +
      (Math.floor(Math.random() * 99) + 1).toString().padStart(2, '0');

    const generateUniqueUsername = async (username) => {
      const test = await this.usersRepository.findByUsername(username);
      if (test) {
        username += Math.floor(Math.random() * 9) + 1; //add 1 number from 1 to 9
        return generateUniqueUsername(username);
      }
      return username;
    };

    username = await generateUniqueUsername(username);
    return username;
  }
}
