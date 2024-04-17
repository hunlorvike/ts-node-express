import jwt, { type SignOptions, type VerifyOptions } from 'jsonwebtoken';
import { HttpException } from '../configs/http.exception';
import { type Payload } from '../types/response.type';
import { REFRESH_SECRETKEY, SECRETKEY } from 'shareds/configs/const.config';

export class JwtHelper {
  public static generateToken(payload: Payload, options?: SignOptions): string {
    if (!SECRETKEY) {
      throw new HttpException(
        500,
        'SECRETKEY is not defined in the environment variables.',
      );
    }
    options = { algorithm: 'HS256', ...options };

    const token = jwt.sign(payload, SECRETKEY, options);
    return `Bearer ${token}`;
  }

  public static generateRefreshToken(payload: Payload, options?: SignOptions): string {
    if (!REFRESH_SECRETKEY) {
      throw new HttpException(
        500,
        'REFRESH_SECRETKEY is not defined in the environment variables.',
      );
    }
    return jwt.sign(payload, REFRESH_SECRETKEY, options);
  }

  public static verifyToken(token: string, options?: VerifyOptions): Payload | null {
    if (!SECRETKEY) {
      throw new HttpException(
        500,
        'SECRETKEY is not defined in the environment variables.',
      );
    }
    options = { algorithms: ['HS256'], ...options };
    try {
      const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
      const decoded = jwt.verify(tokenWithoutBearer, SECRETKEY, options) as Payload;
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
    if (!REFRESH_SECRETKEY) {
      throw new HttpException(
        500,
        'REFRESH_SECRETKEY is not defined in the environment variables.',
      );
    }
    try {
      const decoded = jwt.verify(token, REFRESH_SECRETKEY, options) as Payload;
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
