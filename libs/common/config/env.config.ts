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
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_S3_REGION,
    awsBucket: process.env.BUCKET,
  },
  settings: {
    apiHomeUrl: process.env.API_HOME_URL,
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
  console.log(env);
  switch (env) {
    case 'development':
      return EnvFile.Dev;
    case 'test':
      return EnvFile.Test;
    case 'production':
      return EnvFile.Prod;
    default:
      if (!env) {
        throw new Error('NODE_ENV is not set');
      } else {
        return EnvFile.Prod;
      }
  }
};
