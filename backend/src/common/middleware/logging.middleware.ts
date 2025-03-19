import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength || '-'}b - ${responseTime}ms - ${userAgent} ${ip}`
      );

      // Only log body for POST/PUT/PATCH requests and if body exists
      if (['POST', 'PUT', 'PATCH'].includes(method) && request.body) {
        this.logger.debug('Request Body:', request.body);
      }
    });

    next();
  }
}
