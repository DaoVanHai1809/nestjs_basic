import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export const OPTIONAL_INT_PIPE_NUMBER = '400014: $key should be a number';

/** Convert a string like "1" to a number, but without NaN */
@Injectable()
export class OptionalIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): number | undefined {
    if (value == null) return undefined;
    const num = Number(value);
    if (isNaN(num))
      throw new BadRequestException(
        OPTIONAL_INT_PIPE_NUMBER.replace('$key', metadata.data),
      );
    return num;
  }
}
