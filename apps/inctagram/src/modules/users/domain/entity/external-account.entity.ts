import { OauthExternalAccountDto } from '../../../auth/application/dto/request/oauth-external-account.dto';

export class ExternalAccountEntity {
  provider: string;
  providerId: string;
  userId: string;
  email: string;
  createdAt: Date;

  constructor(dto: OauthExternalAccountDto, userId: string) {
    this.providerId = dto.providerId;
    this.userId = userId;
    this.email = dto.email;
    this.provider = dto.provider;
  }
}
