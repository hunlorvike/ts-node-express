import express, { Application, Request, Response, NextFunction } from 'express';
import initializeDataSource from './database/connection';
import { logger } from './shareds/utils/logger';
import { PORT } from './shareds/configs/const.config';
import fs from 'fs';

export class ServerConfiguration {
  private static instance: ServerConfiguration;

  static getInstance(): ServerConfiguration {
    if (!ServerConfiguration.instance) {
      ServerConfiguration.instance = new ServerConfiguration();
    }
    return ServerConfiguration.instance;
  }

  init(app: Application): this {
    this.connectDB();

    this.initMiddlewares(app);

    this.listen(app, Number(PORT));
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
      if (fs.existsSync('./banner.txt')) {
        console.log(fs.readFileSync('./banner.txt', 'utf8'));
      }
      logger.info('==================================================================');
      logger.info(`Server is now running on http://localhost:${port}/swagger.html`);
      logger.info('==================================================================');
    });
  }

  async connectDB(): Promise<any> {
    await initializeDataSource();
  }
}

const Server = ServerConfiguration.getInstance();
export { Server };
