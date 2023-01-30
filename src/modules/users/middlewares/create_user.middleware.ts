import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class CreateUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('here is create middleware');
    next();
  }
}
