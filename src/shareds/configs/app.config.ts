import { JwtPayload } from 'jsonwebtoken';
import { Action, RoutingControllersOptions } from 'routing-controllers';
import { AuthorizationChecker } from 'routing-controllers/types/AuthorizationChecker';
import { JwtHelper } from '../utils/jwt.helper';
import { AuthController } from '../../modules/auth/controllers/auth.controller';
import { UserController } from '../../modules/users/controllers/user.controller';
import { CurrentUserChecker } from 'routing-controllers/types/CurrentUserChecker';

export const controllers = [AuthController, UserController];

export const authorizationChecker: AuthorizationChecker = async (
    action: Action,
    roles: string[],
) => {
    const authHeader = action.request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return false;
    }
    const payload = JwtHelper.verifyToken(token) as JwtPayload;
    if (payload?.user) {
        const user = payload.user;
        if (user.role && !roles.length) {
            return true;
        }
        if (user.role && roles.find((role) => user.role.indexOf(role) !== -1)) {
            return true;
        }
    }
    return false;
};

export const currentUserChecker: CurrentUserChecker = async (action: Action) => {
    const authHeader = action.request.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return null;
    }

    try {
        const payload = JwtHelper.verifyToken(token) as JwtPayload;
        return payload?.user || null;
    } catch (error) {
        return null;
    }
};

export const routingControllersOptions: RoutingControllersOptions = {
    cors: true,
    classTransformer: true,
    routePrefix: process.env.PREFIX,
    validation: true,
    controllers: controllers,
    authorizationChecker: authorizationChecker,
    currentUserChecker: currentUserChecker,
};
