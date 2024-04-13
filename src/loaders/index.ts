import 'reflect-metadata';
import { Application } from 'express';
import { Server } from './server';
import { logger } from '../shareds/utils/logger';
import { Messages } from '../shareds/consts/messages';

export default (app: Application) => {
   try {
      Server.init(app);
   } catch (error) {
      logger.error(Messages.DB_CONNECTION_FAILED, error);
   }
};
