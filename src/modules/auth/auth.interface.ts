import type { Request as NestRequest } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import type { Request as ExpressRequest } from 'express';
import { Expose } from 'src/providers/prisma/prisma.interface';

export type MfaMethod = 'NONE' | 'SMS' | 'TOTP' | 'EMAIL';

export interface AccessTokenClaims {
  id: number;
  scopes: string[];
  sessionId: number;
  role?: UserRole;
  // userType?: UserType;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface TokenResponseWithUser {
  accessToken: string;
  refreshToken: string;
  user: Expose<User>;
}

export interface TotpTokenResponse {
  totpToken: string;
  type: MfaMethod;
  multiFactorRequired: true;
}

export interface AccessTokenParsed {
  id: number;
  scopes: string[];
  type: 'user' | 'api-key';
  sessionId?: number;
  role?: UserRole;
  // userType?: UserType;
}

export interface MfaTokenPayload {
  id: number;
  type: MfaMethod;
}

type CombinedRequest = ExpressRequest & typeof NestRequest;
export interface UserRequest extends CombinedRequest {
  user: AccessTokenParsed;
}
