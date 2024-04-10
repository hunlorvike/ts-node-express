import { Application } from 'express';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import initializeDataSource from '../database/connection';
import { Server } from './server';

dotenv.config();

export default async (app: Application) => {
    try {
        await initializeDataSource();
        console.log('DB loaded and connected!');

        Server.init(app).listen(Number(process.env.PORT) || 3000);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
};
