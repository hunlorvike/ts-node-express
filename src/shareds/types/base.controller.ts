import express, { Router } from "express";

export abstract class BaseController {
    public router: Router;
    public path: string; 

    constructor() {
        this.router = express.Router();
    }

    public abstract initializeRoutes(): void;
}
