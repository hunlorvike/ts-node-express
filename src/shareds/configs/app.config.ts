import { type JwtPayload } from 'jsonwebtoken';
import { type Action, type RoutingControllersOptions } from 'routing-controllers';
import { type AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';
import { JwtHelper } from '../helpers/jwt.helper';
import { AuthController } from '../../controllers/auth.controller';
import { UserController } from '../../controllers/user.controller';
import { type CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';
import { PREFIX } from './const.config';
import { getRepository } from 'typeorm';
import { User } from 'entities/user.entity';
import { Role } from 'shareds/types/enums/type.enum';
import { HttpException } from './http.exception';
import { getTokenFromHeader } from 'shareds/middlewares/get_token.middleware';

export const controllers = [AuthController, UserController];

export const authorizationChecker: AuthorizationChecker = async (
  action: Action,
  roles: Role[],
) => {
  const token = getTokenFromHeader(action.request.headers.authorization);

  if (!token) {
    throw new HttpException(401, 'Authorization token is missing');
  }

  const payload = JwtHelper.verifyToken(token) as JwtPayload;

  if (!payload?.userId) {
    throw new HttpException(401, 'Invalid token payload');
  }

  const userRepository = getRepository(User);
  const user = await userRepository.findOne({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new HttpException(404, 'User not found');
  }

  if (roles.length === 0 || roles.includes(user.role)) {
    return true;
  }

  throw new HttpException(403, 'Forbidden');
};

export const currentUserChecker: CurrentUserChecker = async (action: Action) => {
  const token = getTokenFromHeader(action.request.headers.authorization);

  if (!token) {
    return null;
  }

  try {
    const payload = JwtHelper.verifyToken(token) as JwtPayload;

    if (!payload?.userId) {
      throw new HttpException(401, 'Invalid token payload');
    }

    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: payload.userId },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    return user;
  } catch (error) {
    return null;
  }
};

export const routingControllersOptions: RoutingControllersOptions = {
  cors: true,
  classTransformer: true,
  routePrefix: PREFIX,
  validation: true,
  controllers,
  authorizationChecker,
  currentUserChecker,
};
