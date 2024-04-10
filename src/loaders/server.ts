import { Application } from "express";
import { createServer, Server as HttpServer } from "http";

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
        this.server = createServer(app);
        return this;
    }

    listen(port: number): any {
        return this.server.listen(port, () => {
            console.log(`Server is now running on port ${port}`);
        });
    }
}

const Server = ServerConfiguration.getInstance();
export { Server }