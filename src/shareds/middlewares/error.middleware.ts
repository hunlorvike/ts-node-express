import { Request, Response, NextFunction } from 'express';

export class HttpException extends Error {
   status: number;
   message: string;
   constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
   }
}

export class InternalServerErrorException extends HttpException {
   constructor(message: string = 'Internal Server Error') {
      super(500, message);
   }
}

export class NotFoundException extends HttpException {
   constructor(message: string = 'Not Found') {
      super(404, message);
   }
}

export class ForbiddenException extends HttpException {
   constructor(message: string = 'Forbidden') {
      super(403, message);
   }
}

export class UnauthorizedException extends HttpException {
   constructor(message: string = 'Unauthorized') {
      super(401, message);
   }
}

export class BadRequestException extends HttpException {
   constructor(message: string = 'Bad Request') {
      super(400, message);
   }
}

export function errorMiddleware(
   error: HttpException,
   request: Request,
   response: Response,
   next: NextFunction,
) {
   const status = error.status || 500;
   const message = error.message || 'Something went wrong';
   response.status(status).send({
      status,
      message,
   });
}
