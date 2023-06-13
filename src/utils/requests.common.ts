import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsJSON, IsOptional, ValidateIf } from 'class-validator';
import { tryTransformJson } from './try-transform-json';

export class ListRequest {
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Transform((e) => +e.value)
  skip?: number = 0;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform((e) => +e.value)
  @IsInt()
  take?: number = 10;

  @ApiPropertyOptional({ type: 'string', format: 'json' })
  @IsOptional()
  @Transform(tryTransformJson)
  @ValidateIf((obj, value) => {
    return value instanceof String;
  })
  @IsJSON()
  where?: object;

  @ApiPropertyOptional({ type: 'string', format: 'json' })
  @IsOptional()
  @IsJSON()
  @ValidateIf((obj, value) => {
    return value instanceof String;
  })
  @Transform(tryTransformJson)
  orderBy?: object;

  @ApiPropertyOptional({ type: 'string', format: 'string' })
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ type: 'string', format: 'json' })
  @IsOptional()
  @Transform(tryTransformJson)
  @ValidateIf((obj, value) => {
    return value instanceof String;
  })
  @IsJSON()
  include?: object;
}
