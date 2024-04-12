import { Application, Request, Response, NextFunction } from 'express';
import { Server as HttpServer } from 'http';
import initializeDataSource from '../database/connection';
import { logger } from '../shareds/utils/logger';
import { errorMiddleware } from '../shareds/middlewares/error.middleware';
import { createExpressServer } from 'routing-controllers';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { routingControllersOptions } from '../shareds/configs/app.config';

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

      this.initErrorHandling(app);

      this.server = createExpressServer(routingControllersOptions);

      return this;
   }

   initMiddlewares(app: Application) {
      app.use((req: Request, res: Response, next: NextFunction) => {
         logger.info(`${req.method} ${req.url}`);
         next();
      });

      app.use(helmet());
   }

   private initErrorHandling(app: Application) {
      app.use(errorMiddleware);
   }

   listen(port: number): any {
      return this.server.listen(port, () => {
         logger.info(`Server is now running on http://localhost:${port}`);
      });
   }

   async connectDB(): Promise<any> {
      await initializeDataSource();
   }
}

const Server = ServerConfiguration.getInstance();
export { Server };
