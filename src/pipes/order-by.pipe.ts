import {
  ArgumentMetadata,
  BadGatewayException,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

export const ORDER_BY_FORMAT = '400012: Invalid ordering format';

/** Convert a string like "name asc, address desc" to { name: "asc", address: "desc" } */
@Injectable()
export class OrderByPipe implements PipeTransform {
  transform(
    value: string,
    metadata: ArgumentMetadata,
  ): Record<string, any> | undefined {
    if (value == null) return undefined;
    try {
      return JSON.parse(value);
    } catch (_) {
      throw new BadRequestException(ORDER_BY_FORMAT);
    }
  }
}
