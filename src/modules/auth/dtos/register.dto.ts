import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsLocale,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

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
