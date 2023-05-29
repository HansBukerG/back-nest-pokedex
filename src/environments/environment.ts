import 'dotenv/config';

export const env = {
  PORT: process.env.PORT,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_URI: process.env.DATABASE_URI,
};
