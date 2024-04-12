import { Application } from 'express';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { Server } from './server';
import { logger } from '../shareds/utils/logger';
import { Messages } from '../shareds/consts/messages';
import { controllers } from '../shareds/consts/controller';

dotenv.config();

export default (app: Application) => {
    try {
        Server.init(app, controllers).listen(Number(process.env.PORT) || 3000); 
    } catch (error) {
        logger.error(Messages.DB_CONNECTION_FAILED, error);
    }
};
