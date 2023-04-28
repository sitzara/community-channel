import {
  Logger,
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthUserRequest } from '../types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  use(req: AuthUserRequest, res: Response, next: NextFunction) {
    const userId = req.headers['user-id'] as string;

    if (!userId) {
      this.logger.log('Unauthorized user');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    req.user = { id: userId };
    next();
  }
}
