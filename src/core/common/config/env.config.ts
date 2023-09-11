import process from 'process';

export type ConfigEnvType = ReturnType<typeof getEnvConfig>;

export const getEnvConfig = () => ({
  secrets: {
    secretAccessToken: process.env.SECRET_ACCESS_TOKEN,
    secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
    timeExpireAccessToken: process.env.TIME_EXPIRING_ACCESS_TOKEN,
    timeExpireRefreshToken: process.env.TIME_EXPIRING_REFRESH_TOKEN,
    passwordSaltHash: process.env.SALT_HASH,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClientId: process.env.GH_CLIENT_ID,
    githubClientSecret: process.env.GH_CLIENT_SECRET,
  },
  settings: {
    appDomainName: process.env.APP_DOMAIN_NAME,
    githubRedirectUrl: process.env.GH_REDIRECT_URL,
    googleRedirectUrl: process.env.GOOGLE_REDIRECT_URL,
  },
  database: {},
  mailer: {},
});

enum EnvFile {
  Test = '.env.test',
  Dev = '.env',
  Prod = '.env.prod',
}
export const getEnvFile = (): string => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'development':
      return EnvFile.Dev;
    case 'test':
      return EnvFile.Test;
    case 'production':
      return EnvFile.Prod;
    default:
      return EnvFile.Prod;
  }
};
