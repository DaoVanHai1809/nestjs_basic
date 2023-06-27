import { Gender } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsIn,
  IsLocale,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';
import {
  EMPTY_EMAIL,
  EMPTY_PASSWORD,
  INVALID_EMAIL,
  INVALID_PASSWORD,
} from '../../../errors/errors.constants';

export class RegisterDtoOld {
  @IsString()
  @IsOptional()
  @MinLength(3)
  name!: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsBoolean()
  @IsOptional()
  checkLocationOnLogin?: boolean;

  @IsString()
  @Length(2, 2)
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsIn(['MALE', 'FEMALE', 'NONBINARY', 'UNKNOWN'])
  @IsOptional()
  gender?: 'MALE' | 'FEMALE' | 'NONBINARY' | 'UNKNOWN';

  @IsIn(['ACCOUNT', 'UPDATES', 'PROMOTIONS'])
  @IsOptional()
  notificationEmails?: 'ACCOUNT' | 'UPDATES' | 'PROMOTIONS';

  @IsString()
  @IsOptional()
  @Length(8)
  password?: string | null;

  @IsLocale()
  @IsOptional()
  prefersLanguage?: string;

  @IsString()
  @IsIn(['NO_PREFERENCE', 'LIGHT', 'DARK'])
  @IsOptional()
  prefersColorScheme?: 'NO_PREFERENCE' | 'LIGHT' | 'DARK';

  @IsString()
  @IsIn(['NO_PREFERENCE', 'REDUCE'])
  @IsOptional()
  prefersReducedMotion?: 'NO_PREFERENCE' | 'REDUCE';

  @IsUrl()
  @IsOptional()
  profilePictureUrl?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsBoolean()
  @IsOptional()
  ignorePwnedPassword?: boolean;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  // @IsOptional()
  // @IsEnum(UserType)
  // userType?: UserType;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string | null;

  // @IsBoolean()
  // @IsOptional()
  // ignorePwnedPassword?: boolean;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName: string | null;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  birthday: Date;

  @IsOptional()
  @IsNotEmpty()
  streetAddress: string;

  @IsOptional()
  @IsNotEmpty()
  apartmentNumber: string;

  @IsOptional()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  prefecture: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  postCode: string;

  @IsBoolean()
  @IsOptional()
  ignorePwnedPassword?: boolean;
}

export class RegisterEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class RegisterFacebookDto {
  @IsNotEmpty()
  token!: string;
}

export class RegisterAppleDto {
  @IsNotEmpty()
  id_token!: string;

  @IsNotEmpty()
  nonce!: string;
}

export class RegisterGoogleDto {
  @IsNotEmpty()
  id_token!: string;
}

export class ResendEmailVerificationDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password!: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  passwordConfirm!: string;

  @IsBoolean()
  @IsOptional()
  ignorePwnedPassword?: boolean;
}

export class LoginDto {
  @IsEmail(
    {},
    {
      message: INVALID_EMAIL,
    },
  )
  @IsNotEmpty({ message: EMPTY_EMAIL })
  email!: string;

  @IsString()
  @MinLength(8, { message: INVALID_PASSWORD })
  @IsOptional({ message: EMPTY_PASSWORD })
  password?: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @Length(6)
  @IsOptional()
  code?: string;

  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class LoginFacebookDto {
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

export class LoginAppleDto {
  @IsNotEmpty()
  id_token!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

export class LoginGoogleDto {
  @IsNotEmpty()
  id_token!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

export class LoginGoogle2Dto {
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}

export class TotpLoginDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsOptional()
  origin?: string;

  @IsString()
  @Length(6)
  @IsNotEmpty()
  code!: string;
}

export class VerifyEmailDtoOld {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}
export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsOptional()
  origin?: string;
}
export class SendEmailVerificationResponseDto {
  @IsBoolean()
  @IsNotEmpty()
  queued!: boolean;
}
