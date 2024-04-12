import { Application, Router, Request, Response, NextFunction } from "express";
import { createServer, Server as HttpServer } from "http";
import userRouter from "../modules/users/routes/user.router";
import initializeDataSource from "../database/connection";
import { BaseController } from "src/shareds/types/base.controller";
import { logger } from "../shareds/utils/logger";
import { errorMiddleware } from "../shareds/middlewares/error.middleware";

export class ServerConfiguration {
    private static instance: ServerConfiguration;
    private server: HttpServer;

    private constructor() { }

    static getInstance(): ServerConfiguration {
        if (!ServerConfiguration.instance) {
            ServerConfiguration.instance = new ServerConfiguration();
        }
        return ServerConfiguration.instance;
    }

    init(app: Application, controllers: BaseController[]): this {
        this.connectDB();

        this.initMiddlewares(app);

        this.initControllers(app, controllers);

        this.initErrorHandling(app);

        this.server = createServer(app);

        return this;
    }

    initMiddlewares(app: Application) {
        app.use((req: Request, res: Response, next: NextFunction) => {
            logger.info(`${req.method} ${req.url}`);
            next();
        });
        
    }

    initControllers(app: Application, controllers: BaseController[]) {
        controllers.forEach((controller) => {
            const router = controller.router;
            app.use(`/api/${controller.path}`, router);
        });
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
