import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

type Payload = {
  id: number;
  username: string;
  iat: EpochTimeStamp;
  exp: EpochTimeStamp;
};

declare global {
  namespace Express {
    interface Request {
      user: Payload;
    }
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const decoded = jwt.verify(token, process.env.SALT as string) as Payload;
      req.user = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
