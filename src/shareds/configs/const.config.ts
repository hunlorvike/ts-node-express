import * as dotenv from 'dotenv';

dotenv.config();

export const { LOG_DIR, PREFIX, PORT } = process.env;

export const { SECRETKEY, REFRESH_SECRETKEY } = process.env;

export const { DB_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
  process.env;
