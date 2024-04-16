import { Middleware, type ExpressMiddlewareInterface } from 'routing-controllers';
import { type Request, type Response, type NextFunction } from 'express';
import { type JwtPayload } from 'jsonwebtoken';
import { HttpException } from '../configs/http.exception';
import { JwtHelper } from '../utils/jwt.helper';

@Middleware({ type: 'before' })
export class AuthenticatedMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): any {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      next(new HttpException(401, 'Unauthorized'));
      return;
    }

    try {
      const payload = JwtHelper.verifyToken(token) as JwtPayload;
      req.user = payload;
      next();
    } catch (error) {
      next(new HttpException(401, 'Unauthorized'));
    }
  }
}

@Middleware({ type: 'before' })
export class AuthorizeMiddleware implements ExpressMiddlewareInterface {
  private readonly roles: string[];

  constructor(roles: string[]) {
    this.roles = roles;
  }

  use(req: Request, res: Response, next: NextFunction): any {
    if (!req.user) {
      next(new HttpException(401, 'Unauthorized'));
      return;
    }

    const userRole = req.user.role;
    if (this.roles.includes(userRole)) {
      next();
    } else {
      next(new HttpException(403, 'Forbidden'));
    }
  }

  static withRoles(
    roles: string[],
  ): (req: Request, res: Response, next: NextFunction) => any {
    return new AuthorizeMiddleware(roles).use;
  }
}
