import { Module, NestModule } from '@nestjs/common';
import { RequestMethod } from '@nestjs/common/enums';
import { MiddlewareConsumer } from '@nestjs/common/interfaces/middleware';
import { UsersController } from './controllers/users.controller';
import { CreateUserMiddleware } from './middlewares/create_user.middleware';
import { UserMiddleware } from './middlewares/users.middleware';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .forRoutes(
        {
          path: 'users/create',
          method: RequestMethod.POST,
        },
        {
          path: 'users/:id',
          method: RequestMethod.GET,
        },
      )
      .apply(CreateUserMiddleware)
      .forRoutes('users/create');
  }
}
