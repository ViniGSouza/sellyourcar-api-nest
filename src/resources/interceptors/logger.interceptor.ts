import {
  CallHandler,
  ConsoleLogger,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { RequestUser } from 'src/modules/auth/auth.strategy';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: ConsoleLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const contextHttp = context.switchToHttp();

    const request = contextHttp.getRequest<Request | RequestUser>();
    const response = contextHttp.getResponse<Response>();

    const { url, method } = request;
    const { statusCode } = response;

    if (request.user && 'name' in request.user) {
      this.logger.log(`Rota acessada pelo usuário: ${request.user.name} ${method} ${url}`);
    } else {
      this.logger.log(`${method} ${url}`);
    }

    const beforeController = Date.now();

    return next.handle().pipe(
      tap(() => {
        const routeTimeExecution = Date.now() - beforeController;
        this.logger.log(
          `Resposta: status ${statusCode} - ${routeTimeExecution}ms`,
        );
      }),
    );
  }
}
