import { Payload } from "./response.type";

declare global {
    namespace Express {
        interface Request {
            user?: Payload;
        }
    }
}
