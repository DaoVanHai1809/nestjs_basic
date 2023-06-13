import { ApiPropertyOptional, ApiResponseProperty } from '@nestjs/swagger';

export enum TriggerStatus {
  OK = 'OK',
  FAILED = 'FAILED',
}

export class TriggerResponse {
  @ApiResponseProperty({ enum: TriggerStatus })
  status: TriggerStatus;

  @ApiResponseProperty()
  @ApiPropertyOptional()
  message?: string;
}

export class ListResponse<T> {
  @ApiResponseProperty()
  total: number;
  @ApiResponseProperty({ type: [Object] })
  data: T[];
}

export class ErrorDetail<T> {
  @ApiResponseProperty()
  data: T;

  @ApiResponseProperty()
  message: string;
}
export enum ExecutionStatus {
  OK = 'OK',
  FAILED = 'FAILED',
}

export class ImportResultResponse<T> {
  @ApiResponseProperty()
  imported: number;
  @ApiResponseProperty({
    type: [ErrorDetail<T>],
  })
  errors: { data: T; message: string }[];

  @ApiResponseProperty({ type: [Object] })
  duplicates: number;

  constructor(
    imported = 0,
    errors: { data: T; message: string }[] = [],
    duplicates = 0,
  ) {
    this.imported = imported;
    this.errors = errors;
    this.duplicates = duplicates;
  }
}