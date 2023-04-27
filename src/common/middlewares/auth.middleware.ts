import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthUserRequest } from '../types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: AuthUserRequest, res: Response, next: NextFunction) {
    const userId = req.headers['user-id'] as string;
    console.log('userId', userId);
    if (!userId) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    req.user = { id: userId };
    next();
  }
}
