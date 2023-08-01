import process from 'process';

export type ConfigEnvType = ReturnType<typeof getEnvConfig>;

export const getEnvConfig = () => ({
  secrets: {
    secretAccessToken: process.env.SECRET_ACCESS_TOKEN,
    secretRefreshToken: process.env.SECRET_REFRESH_TOKEN,
    timeExpireAccessToken: process.env.TIME_EXPIRING_ACCESS_TOKEN,
    timeExpireRefreshToken: process.env.TIME_EXPIRING_REFRESH_TOKEN,
  },
  database: {},
  mailer: {},
});
