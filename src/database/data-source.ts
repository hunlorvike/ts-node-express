import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { resolve } from 'path';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.POSTGRES_PORT) || 5454,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    synchronize: false,
    logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

