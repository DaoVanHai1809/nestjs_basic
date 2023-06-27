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
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  birthday: Date;

  @IsBoolean()
  @IsOptional()
  ignorePwnedPassword?: boolean;
}
