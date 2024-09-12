import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class SetCookiesInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      tap((data: any) => {
        if (data?.token) {
          const { accessToken, refreshToken } = data.token;

          console.log('accessToken', data.token);

          // Set the access token cookie
          response.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, // Set to true if using https
            sameSite: 'strict', // CSRF protection
          });

          response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, // Set to true if using https
            sameSite: 'strict', // CSRF protection
          });

          // Optionally remove tokens from the response body if you don't want them in the JSON response
          delete data.token;
        }
      }),
    );
  }
}
