import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DatabaseLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Database');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;

    const startTime = Date.now();
    return next.handle().pipe(
      tap({
        next: (data) => {
          const endTime = Date.now();
          this.logger.log(
            `${method} ${path} - Query executed successfully in ${endTime - startTime}ms`
          );
          this.logger.debug('Query result:', data);
        },
        error: (error) => {
          const endTime = Date.now();
          this.logger.error(
            `${method} ${path} - Query failed in ${endTime - startTime}ms`,
            error.stack
          );
        },
      })
    );
  }
}
