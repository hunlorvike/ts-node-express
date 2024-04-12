import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { HttpException } from './error.middleware';
import { JwtHelper } from '../utils/jwt.helper';

declare global {
   namespace Express {
      interface Request {
         user?: JwtPayload;
      }
   }
}

@Middleware({ type: 'before' })
export class AuthenticatedMiddleware implements ExpressMiddlewareInterface {
   use(req: Request, res: Response, next: NextFunction): any {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1];

      if (!token) {
         return next(new HttpException(401, 'Unauthorized'));
      }

      try {
         const payload = JwtHelper.verifyToken(token) as JwtPayload;
         req.user = payload;
         next();
      } catch (error) {
         return next(new HttpException(401, 'Unauthorized'));
      }
   }
}

@Middleware({ type: 'before' })
export class AuthorizeMiddleware implements ExpressMiddlewareInterface {
   private roles: string[];

   constructor(roles: string[]) {
      this.roles = roles;
   }

   use(req: Request, res: Response, next: NextFunction): any {
      if (!req.user) {
         return next(new HttpException(401, 'Unauthorized'));
      }

      const userRole = req.user.role;
      if (this.roles.includes(userRole)) {
         next();
      } else {
         return next(new HttpException(403, 'Forbidden'));
      }
   }

   static withRoles(
      roles: string[],
   ): (req: Request, res: Response, next: NextFunction) => any {
      return new AuthorizeMiddleware(roles).use;
   }
}
