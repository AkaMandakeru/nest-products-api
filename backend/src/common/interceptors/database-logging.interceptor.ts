import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class DatabaseLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    console.log(`[Database Operation] ${method} ${url}`);

    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        console.log(`[Database Response] ${method} ${url} - ${responseTime}ms`);
        console.log('[Database Data]', JSON.stringify(data, null, 2));
      }),
    );
  }
}
