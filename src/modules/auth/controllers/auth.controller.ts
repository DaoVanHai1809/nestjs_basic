import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { RegisterDto } from '../dtos';
import { AuthService } from '../services/auth.service';
import { RateLimit } from '../rate-limit.decorator';
import { TokenResponse, TotpTokenResponse } from '../auth.interface';
import { LoginDto } from '../dtos/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @RateLimit(10)
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @RateLimit(10)
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() data: LoginDto,
    @Ip() ip: string,
    @Headers('User-Agent') userAgent: string,
    @Body('origin') origin?: string,
  ): Promise<TokenResponse | TotpTokenResponse | object> {
    return await this.authService.login(
      ip,
      userAgent,
      data.email,
      data.password,
      data.code,
      origin,
      response,
      data.rememberMe,
    );
  }

  /** Approve a new subnet */
  @Post('approve-subnet')
  @RateLimit(5)
  async approveSubnet(
    @Ip() ip: string,
    @Headers('User-Agent') userAgent: string,
    @Body('token') token: string,
  ): Promise<TokenResponse> {
    return this.authService.approveSubnet(ip, userAgent, token);
  }
}
