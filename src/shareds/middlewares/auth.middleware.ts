import { Request, Response, NextFunction } from 'express';
import { JwtHelper } from "../utils/jwt.helper";
import { HttpException } from "./error.middleware";
 

export function authenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new HttpException(401, 'Unauthorized'));
    }

    try {
        const payload = JwtHelper.verifyToken(token);
        if (!payload) {
            throw new Error();
        }
        req.user = payload;
        next();
    } catch (error) {
        return next(new HttpException(401, 'Unauthorized'));
    }
}

export function authorize(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            return next(new HttpException(403, 'Forbidden'));
        }
    }
}
