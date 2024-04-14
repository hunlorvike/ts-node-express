import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { HttpException } from '../middlewares/error.middleware';
import { Payload } from '../types/response.type';
dotenv.config();

export class JwtHelper {
    public static generateToken(payload: Payload, options?: SignOptions): string {
        if (!process.env.SECRETKEY) {
            throw new HttpException(
                500,
                'SECRETKEY is not defined in the environment variables.',
            );
        }
        options = { algorithm: 'HS256', ...options };

        const token = jwt.sign(payload, process.env.SECRETKEY, options);
        return `Bearer ${token}`;
    }

    public static generateRefreshToken(payload: Payload, options?: SignOptions): string {
        if (!process.env.REFRESH_SECRETKEY) {
            throw new HttpException(
                500,
                'REFRESH_SECRETKEY is not defined in the environment variables.',
            );
        }
        return jwt.sign(payload, process.env.REFRESH_SECRETKEY, options);
    }

    public static verifyToken(token: string, options?: VerifyOptions): Payload | null {
        if (!process.env.SECRETKEY) {
            throw new HttpException(
                500,
                'SECRETKEY is not defined in the environment variables.',
            );
        }
        options = { algorithms: ['HS256'], ...options };
        try {
            const tokenWithoutBearer = token.startsWith('Bearer ')
                ? token.slice(7)
                : token;
            const decoded = jwt.verify(
                tokenWithoutBearer,
                process.env.SECRETKEY,
                options,
            ) as Payload;
            return decoded;
        } catch (error) {
            throw new HttpException(
                401,
                `Error verifying token: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            );
        }
    }

    public static verifyRefreshToken(
        token: string,
        options?: VerifyOptions,
    ): Payload | null {
        if (!process.env.REFRESH_SECRETKEY) {
            throw new HttpException(
                500,
                'REFRESH_SECRETKEY is not defined in the environment variables.',
            );
        }
        try {
            const decoded = jwt.verify(
                token,
                process.env.REFRESH_SECRETKEY,
                options,
            ) as Payload;
            return decoded;
        } catch (error) {
            throw new HttpException(
                401,
                `Error verifying refresh token: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            );
        }
    }

    public static decodeToken(token: string): Payload | null {
        try {
            const decoded = jwt.decode(token) as Payload;
            return decoded;
        } catch (error) {
            throw new HttpException(
                400,
                `Error decoding token: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
            );
        }
    }
}
