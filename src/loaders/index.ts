import { Application } from 'express';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import initializeDataSource from '../database/connection';
import { Server } from './server';
import { logger } from '../shareds/utils/logger';
import { Messages } from '../shareds/messages/messages';

dotenv.config();

export default async (app: Application) => {
    try {
        await initializeDataSource();
        logger.info(Messages.DB_CONNECTED); 

        Server.init(app).listen(Number(process.env.PORT) || 3000);
    } catch (error) {
        logger.error(Messages.DB_CONNECTION_FAILED, error); 
    }
};
