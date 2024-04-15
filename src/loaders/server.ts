import 'reflect-metadata';
import express, { Application, Request, Response, NextFunction } from 'express';
import { Server as HttpServer } from 'http';
import initializeDataSource from '../database/connection';
import { logger } from '../shareds/utils/logger';
import * as dotenv from 'dotenv';

dotenv.config();

export class ServerConfiguration {
    private static instance: ServerConfiguration;
    private server: HttpServer;

    private constructor() {}

    static getInstance(): ServerConfiguration {
        if (!ServerConfiguration.instance) {
            ServerConfiguration.instance = new ServerConfiguration();
        }
        return ServerConfiguration.instance;
    }

    init(app: Application): this {
        this.connectDB();

        this.initMiddlewares(app);

        this.listen(app, Number(process.env.PORT) || 3000);
        return this;
    }

    initMiddlewares(app: Application) {
        app.use((req: Request, res: Response, next: NextFunction) => {
            logger.info(`${req.method} ${req.url}`);
            next();
        });

        app.use(express.json());

        app.use(express.urlencoded({ extended: true }));

        app.use(express.static('public'));
    }

    listen(app: Application, port: number): any {
        return app.listen(port, () => {
            logger.info(`Server is now running on http://localhost:${port}/swagger.html`);
        });
    }

    async connectDB(): Promise<any> {
        await initializeDataSource();
    }
}

const Server = ServerConfiguration.getInstance();
export { Server };
