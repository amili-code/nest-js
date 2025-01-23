import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { LoggerMiddleware } from './logger/logger.middleware'
import { DosSaverMiddleware } from './dos-saver/dos-saver.middleware'

@Module({
  imports: [UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users')
    consumer.apply(DosSaverMiddleware).forRoutes('*')
  }
}
