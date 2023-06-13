import { SetMetadata } from '@nestjs/common';

export const PRIVILEGES_KEY = 'privileges';
export const Privilege = (privileges: string[] | string) =>
  SetMetadata(
    PRIVILEGES_KEY,
    typeof privileges == 'string' ? [privileges] : privileges,
  );
