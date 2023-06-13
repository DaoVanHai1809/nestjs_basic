import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export const WHERE_PIPE_FORMAT = '400013: Invalid query format';

/** Convert a string like "id: 12, b: 'Anand'" to { id: 12, name: "Anand" } */
@Injectable()
export class WherePipe implements PipeTransform {
  transform(value: string): Record<string, any> | undefined {
    if (value == null) return undefined;
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(WHERE_PIPE_FORMAT);
    }
  }
}
