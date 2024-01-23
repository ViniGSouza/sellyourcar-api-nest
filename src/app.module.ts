import { Module, ConsoleLogger } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CarModule } from './modules/car/car.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerInterceptor } from './resources/interceptors/logger.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './resources/filters/global-filter-exception';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, CarModule, AuthModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    ConsoleLogger,
  ],
})
export class AppModule {}
