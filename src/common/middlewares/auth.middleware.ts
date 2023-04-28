import {
  Logger,
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { AuthUserRequest } from '../types';

/*
 * A simple logic was added to this middleware
 * (only checking if 'user-id' header is provided)
 * to be able to get userId inside controllers Rooms, RoomUsers, RoomMessages
 * in real application users must send Credentials or Auth Token in header
 * to be Authenticated and userId should be found based on this data
 */
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
