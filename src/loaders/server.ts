import { Application, Router } from "express";
import { createServer, Server as HttpServer } from "http";
import userRouter from "../modules/users/routes/user.router";
import initializeDataSource from "../database/connection";

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

    init(app: Application): this {
        const apiRouter = Router();
        apiRouter.use('/users', userRouter);

        app.use('/api', apiRouter); // TODO: PREFIX

        this.server = createServer(app);

        return this;
    }

    listen(port: number): any {
        return this.server.listen(port, () => {
            console.log(`Server is now running on port localhost:${port}`);
        });
    }

    async connectDB(): Promise<any> {
       await initializeDataSource();
    }
}

const Server = ServerConfiguration.getInstance();
export { Server }
