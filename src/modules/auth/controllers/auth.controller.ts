import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RegisterDto } from '../dtos';
import { AuthService } from '../services/auth.service';
import { RateLimit } from '../rate-limit.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RateLimit(10)
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }
}
