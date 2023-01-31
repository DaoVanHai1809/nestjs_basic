import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { RegisterDto } from '../dtos';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const hashedPassword = await argon.hash(data.password);
    const checkEmail = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (checkEmail) {
      throw new ForbiddenException('Email already exists');
    }
    const user = await this.prismaService.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
    return await this.signJwtToken(user.id, user.email);
  }

  async login(data: any) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User not found');
    }
    const passwordMatched = await argon.verify(user.password, data.password);
    if (!passwordMatched) {
      throw new ForbiddenException('Incorrect password');
    }
    delete user.password;
    return await this.signJwtToken(user.id, user.email);
  }

  async signJwtToken(
    userId: number,
    email: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const jwtString = await this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.configService.get('JWT_SECRET'),
    });
    return {
      accessToken: jwtString,
    };
  }
}
