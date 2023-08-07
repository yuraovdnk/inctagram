import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../../../users/instrastructure/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { mapErrors } from '../../../../core/common/exception/validator-errors';
import { validateOrReject } from 'class-validator';
import { LoginDto } from '../dto/request/login.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }
}

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private usersRepository: UsersRepository) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    await validateOrReject(new LoginDto(email, password)).catch(() => {
      throw new BadRequestException(
        mapErrors('email or password is incorrect', 'email or password'),
      );
    });

    const candidate = await this.usersRepository.findByEmail(email);

    if (!candidate || !candidate.isConfirmedEmail) {
      throw new UnauthorizedException();
    }

    const isValidPassword = bcrypt.compareSync(
      password,
      candidate.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(
        mapErrors('login or password is not correct', 'auth'),
      );
    }
    return candidate;
  }
}
