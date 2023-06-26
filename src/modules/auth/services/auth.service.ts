import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { RegisterDto } from '../dtos';
import * as argon from 'argon2';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common/exceptions';
import { TokensService } from '../../../providers/tokens/tokens.service';
import { safeEmail } from '../../../helpers/safe-email';
import {
  APPROVE_SUBNET_TOKEN,
  EMAIL_MFA_TOKEN,
  EMAIL_VERIFY_TOKEN,
  LOGIN_ACCESS_TOKEN,
  MERGE_ACCOUNTS_TOKEN,
  MULTI_FACTOR_TOKEN,
  PASSWORD_RESET_TOKEN,
} from '../../../providers/tokens/tokens.constants';
import { PwnedService } from '../../../providers/pwned/pwned.service';
import {
  COMPROMISED_PASSWORD,
  NOT_FOUND_USER,
} from 'src/errors/errors.constants';
import { MailService } from '../../../providers/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokensService: TokensService,
    private pwnedService: PwnedService,
    private email: MailService,
  ) {}

  //new register
  async register(_data: RegisterDto) {
    const { password, ignorePwnedPassword, token, ...data } = _data;
    // const { id } = this.tokensService.verify<{ id: number }>(
    //   EMAIL_VERIFY_TOKEN,
    //   token,
    // );
    const userEmail = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (userEmail) throw new NotFoundException('email exists');

    if (password)
      data['password'] = await this.hashAndValidatePassword(
        password,
        !!ignorePwnedPassword,
      );
    //create
    const pass: string = data['password'];
    if (pass) delete data['password'];
    const user = await this.prisma.user.create({
      data: {
        password: pass,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
    if (user) return this.sendEmailVerification(data.email, true);
    throw new ServiceUnavailableException();
  }

  async login(data: any) {
    const user = await this.prisma.user.findFirst({
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
  async hashAndValidatePassword(
    password: string,
    ignorePwnedPassword: boolean,
  ): Promise<string> {
    if (!ignorePwnedPassword) {
      if (!this.configService.get<boolean>('security.passwordPwnedCheck'))
        return await hash(
          password,
          this.configService.get<number>('security.saltRounds') ?? 10,
        );
      if (!(await this.pwnedService.isPasswordSafe(password)))
        throw new BadRequestException(COMPROMISED_PASSWORD);
    }
    return await hash(
      password,
      this.configService.get<number>('security.saltRounds') ?? 10,
    );
  }

  async sendEmailVerification(
    email: string,
    activate = false,
    origin?: string,
  ): Promise<object> {
    const emailSafe = safeEmail(email);
    const emailDetails = await this.prisma.user.findFirst({
      where: { email: emailSafe },
    });
    if (!emailDetails) throw new NotFoundException(NOT_FOUND_USER);
    console.log({ emailDetails });

    this.email.send({
      mailTo: { name: emailDetails.firstName, email },
      senderType: 'noreply',
      subject: 'register successfully',
      template: 'test',
      data: {
        name: emailDetails.firstName,
        days: 1,
        email: email,
        link: 'http://localhost:3000/login',
        linkShow: 'http://localhost:3000',
        // origin ??
        // this.configService.get<string>('frontendUrl') +
        //   '/auth/registration-form',
      },
    });
    return { status: 201, statusCode: 201, message: 'success' };
  }
}
