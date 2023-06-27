import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../providers/prisma/prisma.service';
import { RegisterDto } from '../dtos';
import * as argon from 'argon2';
import { compare, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import anonymize from 'ip-anonymize';
import { Request, Response } from 'express';
import {
  groupAdminScopes,
  groupMemberScopes,
  groupOwnerScopes,
  userScopes,
} from '../../../helpers/scopes';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common/exceptions';
import { TokensService } from '../../../providers/tokens/tokens.service';
import { safeEmail } from '../../../helpers/safe-email';
import { GeolocationService } from '../../../providers/geolocation/geolocation.service';
import {
  APPROVE_SUBNET_TOKEN,
  EMAIL_MFA_TOKEN,
  EMAIL_VERIFY_TOKEN,
  LOGIN_ACCESS_TOKEN,
  MERGE_ACCOUNTS_TOKEN,
  MULTI_FACTOR_TOKEN,
  PASSWORD_RESET_TOKEN,
} from '../../../providers/tokens/tokens.constants';
import { Expose } from '../../../providers/prisma/prisma.interface';
import UAParser from 'ua-parser-js';
import { PwnedService } from '../../../providers/pwned/pwned.service';
import {
  COMPROMISED_PASSWORD,
  INCORRECT_EMAIL,
  INCORRECT_PASSWORD,
  NOT_FOUND_USER,
  NO_TOKEN_PROVIDED,
  UNVERIFIED_LOCATION,
} from 'src/errors/errors.constants';
import { MailService } from '../../../providers/mail/mail.service';
import {
  AccessTokenClaims,
  TokenResponse,
  TokenResponseWithUser,
  TotpTokenResponse,
} from '../auth.interface';
import { User } from '@prisma/client';
import { ApprovedSubnetsService } from '../../../modules/approved-subnets/approved-subnets.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private tokensService: TokensService,
    private pwnedService: PwnedService,
    private email: MailService,
    private geolocationService: GeolocationService,
    private approvedSubnetsService: ApprovedSubnetsService,
  ) {}

  //new register
  async register(_data: RegisterDto) {
    const { password, ignorePwnedPassword, token, ...data } = _data;
    // const { id } = this.tokensService.verify<{ id: number }>(
    //   EMAIL_VERIFY_TOKEN,
    //   token,
    // );
    const userEmail = await this.prisma.email.findFirst({
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
        name: data.name,
        emails: {
          connectOrCreate: {
            where: {
              email: data.email,
            },
            create: {
              email: data.email,
              emailSafe: data.email,
            },
          },
        },
      },
    });
    if (user) return this.sendEmailVerification(data.email, true);
    throw new ServiceUnavailableException();
  }

  async login(
    ipAddress: string,
    userAgent: string,
    email: string,
    password?: string,
    code?: string,
    origin?: string,
    response?: Response,
    rememberMe?: boolean,
  ): Promise<TokenResponse | TotpTokenResponse | object> {
    const emailSafe = safeEmail(email);
    const user = await this.prisma.user.findFirst({
      where: { emails: { some: { emailSafe } }, deletedFlg: false },
      include: {
        emails: true,
        prefersEmail: true,
      },
    });
    console.log({ user });

    if (!user) throw new NotFoundException(NOT_FOUND_USER);
    // verify email
    // if (!user.emails.find((i) => i.emailSafe === emailSafe)?.isVerified) {
    //   throw new NotFoundException(INCORRECT_EMAIL);
    // }
    // if (!password || !user.password) return this.mfaResponse(user, 'EMAIL');
    // if (!user.prefersEmail) throw new BadRequestException(INCORRECT_EMAIL);
    if (!user.password || !(await compare(password, user.password)))
      throw new UnauthorizedException('password is incorrect');

    await this.checkLoginSubnet(
      ipAddress,
      userAgent,
      user.checkLocationOnLogin,
      user.id,
      origin,
    );
    return this.loginResponse(ipAddress, userAgent, user, response, rememberMe);
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
    const emailDetails = await this.prisma.email.findFirst({
      where: { email: emailSafe },
      include: { user: true },
    });
    if (!emailDetails) throw new NotFoundException(NOT_FOUND_USER);
    console.log({ emailDetails });

    this.email.send({
      mailTo: { name: emailDetails.user.name, email },
      senderType: 'noreply',
      subject: 'register successfully',
      template: 'test',
      data: {
        name: emailDetails.user.name,
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

  private async checkLoginSubnet(
    ipAddress: string,
    _: string, // userAgent
    checkLocationOnLogin: boolean,
    id: number,
    origin?: string,
  ): Promise<void> {
    if (!checkLocationOnLogin) return;
    const subnet = anonymize(ipAddress);
    const previousSubnets = await this.prisma.approvedSubnet.findMany({
      where: { user: { id } },
    });
    let isApproved = false;
    for await (const item of previousSubnets) {
      if (!isApproved)
        if (await compare(subnet, item.subnet)) isApproved = true;
    }
    if (!isApproved) {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { name: true, prefersEmail: true, checkLocationOnLogin: true },
      });
      if (!user) throw new NotFoundException(NOT_FOUND_USER);
      if (!user.checkLocationOnLogin) return;
      const location = await this.geolocationService.getLocation(ipAddress);
      const locationName =
        [
          location?.city?.names?.en,
          (location?.subdivisions ?? [])[0]?.names?.en,
          location?.country?.names?.en,
        ]
          .filter((i) => i)
          .join(', ') || 'Unknown location';
      if (user.prefersEmail)
        this.email.send({
          mailTo: {
            name: user.name,
            email: user.prefersEmail.email,
          },
          template: 'auth/approve-subnet',
          senderType: 'noreply',
          data: {
            name: user.name,
            locationName,
            minutes: 30,
            link: `http://localhost:3000/auth/link/approve-subnet?token=${this.tokensService.signJwt(
              APPROVE_SUBNET_TOKEN,
              { id },
              '30m',
            )}`,
          },
        });
      throw new UnauthorizedException(UNVERIFIED_LOCATION);
    }
  }

  async loginResponse(
    ipAddress: string,
    userAgent: string,
    user: User,
    response?: Response,
    rememberMe?: boolean,
  ): Promise<TokenResponseWithUser> {
    const token = await this.tokensService.generateRandomString(64);
    const ua = new UAParser(userAgent);
    const location = await this.geolocationService.getLocation(ipAddress);
    const operatingSystem =
      `${ua.getOS().name ?? ''} ${ua.getOS().version ?? ''}`
        .replace('Mac OS', 'macOS')
        .trim() || undefined;
    const existingMobileSessions = await this.prisma.session.findMany({
      where: {
        userId: user.id,
        OR: [
          {
            userAgent: { startsWith: 'okhttp' }, // for android
          },
          {
            userAgent: { startsWith: 'Matching' }, // for ios
          },
        ],
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });
    const MAX_SESSION = 1;
    if (existingMobileSessions.length >= MAX_SESSION) {
      for (let i = 0; i < MAX_SESSION - 1; i++) {
        existingMobileSessions.pop();
      }
      await this.prisma.session.deleteMany({
        where: {
          id: { in: existingMobileSessions.map((e) => e.id) },
        },
      });
    }
    const { id } = await this.prisma.session.create({
      data: {
        token,
        ipAddress,
        city: location?.city?.names?.en,
        region: location?.subdivisions?.pop()?.names?.en,
        timezone: location?.location?.time_zone,
        countryCode: location?.country?.iso_code,
        userAgent,
        browser:
          `${ua.getBrowser().name ?? ''} ${
            ua.getBrowser().version ?? ''
          }`.trim() || undefined,
        operatingSystem,
        user: { connect: { id: user.id } },
      },
    });
    const accessToken = await this.getAccessToken(user, id);
    // console.log(response);
    if (response && user.role !== 'ADMIN') {
      response.cookie(process.env.COOKIE_LOGIN_NAME, accessToken, {
        httpOnly: true,
        domain: process.env.FRONTEND_DOMAIN,
        ...(rememberMe ? { maxAge: 365 * 24 * 60 * 60 * 1000 } : {}),
      });
    }
    return {
      accessToken,
      refreshToken: token,
      user: this.prisma.expose<User>(user),
    };
  }

  private async getAccessToken(user: User, sessionId: number): Promise<string> {
    const scopes = await this.getScopes(user);
    const payload: AccessTokenClaims = {
      id: user.id,
      sessionId,
      scopes,
      role: user.role,
      // userType: user.userType,
    };
    console.log({ payload });

    return this.tokensService.signJwt(
      LOGIN_ACCESS_TOKEN,
      payload,
      '1h',
      //this.configService.get<string>('security.accessTokenExpiry'),
    );
  }

  /** Get logging in scopes for a user */
  async getScopes(user: User): Promise<string[]> {
    // Superadmins can do anything
    if (user.role === 'SUDO' || user.role === 'ADMIN') return ['*'];

    // Add all scopes for user self
    const scopes: string[] = Object.keys(userScopes).map((scope) =>
      scope.replace('{userId}', user.id.toString()),
    );
    return scopes;
  }

  async approveSubnet(
    ipAddress: string,
    userAgent: string,
    token: string,
  ): Promise<TokenResponse> {
    // if (!token) throw new UnprocessableEntityException(NO_TOKEN_PROVIDED);
    // const { id } = this.tokensService.verify<{ id: number }>(
    //   LOGIN_ACCESS_TOKEN,
    //   token,
    // );
    const user = await this.prisma.user.findUnique({ where: { id: 1 } });
    if (!user) throw new NotFoundException(NOT_FOUND_USER);
    await this.approvedSubnetsService.approveNewSubnet(user.id, ipAddress);
    return this.loginResponse(ipAddress, userAgent, user);
  }
}
