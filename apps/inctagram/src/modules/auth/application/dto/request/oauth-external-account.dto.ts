export class OauthExternalAccountDto {
  provider: string;
  providerId: string;
  displayName: string;
  email: string;
  username: string;

  constructor(
    provider: string,
    providerId: string,
    displayName: string,
    email: string,
    username: string,
  ) {
    this.providerId = providerId;
    this.email = email;
    this.provider = provider;
    this.displayName = displayName;
    this.username = username;
  }
}
