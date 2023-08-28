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
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  database: {},
  mailer: {},
});
