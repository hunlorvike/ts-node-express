import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5555,
    username: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
    synchronize: false,
    logging: false
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;