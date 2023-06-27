import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { async as cryptoRandomString } from 'crypto-random-string';
import {
  DecodeOptions,
  SignOptions,
  VerifyOptions,
  decode,
  sign,
  verify,
} from 'jsonwebtoken';
import {
  INVALID_TOKEN,
  MESSAGE_INVALID_TOKEN,
} from 'src/errors/errors.constants';
import { v4 } from 'uuid';

@Injectable()
export class TokensService {
  constructor(private configService: ConfigService) {}

  /**
   * Sign a JWT
   * @param subject - Subject
   * @param payload - Object payload
   * @param expiresIn - Expiry string (vercel/ms)
   * @param options - Signing options
   */
  signJwt(
    subject: string,
    payload: number | string | object | Buffer,
    expiresIn?: string,
    options?: SignOptions,
  ) {
    console.log({ subject, payload, expiresIn, options });

    if (typeof payload === 'number') payload = payload.toString();
    return sign(
      payload,
      this.configService.get<string>('security.jwtSecret') ?? 'staart',
      {
        ...options,
        subject,
        expiresIn,
      },
    );
  }

  /**
   * Verify and decode a JWT
   * @param subject - Subject
   * @param token - JWT
   * @param options - Verify options
   */
  verify<T>(subject: string, token: string, options?: VerifyOptions) {
    try {
      return verify(token, '1h', {
        ...options,
        subject,
      }) as any as T;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(MESSAGE_INVALID_TOKEN, INVALID_TOKEN);
    }
  }

  /**
   * Decode a JWT without verifying it
   * @deprecated Use verify() instead
   * @param token - JWT
   * @param options - Decode options
   */
  decode<T>(token: string, options?: DecodeOptions) {
    return decode(token, options) as T;
  }

  /**
   * Generate a UUID
   */
  generateUuid() {
    return v4();
  }

  /**
   * Generate a cryptographically strong random string
   * @param length - Length of returned string
   * @param charactersOrType - Characters or one of the supported types
   */
  async generateRandomString(
    length = 32,
    charactersOrType = 'alphanumeric',
  ): Promise<string> {
    if (
      [
        'hex',
        'base64',
        'url-safe',
        'numeric',
        'distinguishable',
        'ascii-printable',
        'alphanumeric',
      ].includes(charactersOrType)
    )
      return cryptoRandomString({
        length,
        type: charactersOrType as
          | 'hex'
          | 'base64'
          | 'url-safe'
          | 'numeric'
          | 'distinguishable'
          | 'ascii-printable'
          | 'alphanumeric',
      });
    return cryptoRandomString({ length, characters: charactersOrType });
  }
}
