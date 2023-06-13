import { PrismaClient } from '@prisma/client';

export const condensePrismaQuery = (
  prismaQuery: Record<string, unknown>,
  delimiter = '.',
) => {
  const result = {};
  const flatten = (obj: any, stack: any) => {
    Object.keys(obj??{}).forEach((key) => {
      const s = stack
        ?.concat([key === 'select' ? undefined : key.trim()])
        ?.filter(Boolean);

      const child = obj[key];
      if (typeof child === 'object') {
        flatten(child, s);
      } else {
        const twoLastInChain = s?.slice(s.length - 2, s.length)?.join(delimiter);
        result[twoLastInChain] = true;
      }
    });
  };
  flatten(prismaQuery, []);

  const output = Object.keys(result).join(', ');
  return `Prisma: ${output}`;
};

// Screenshot of a trace sample: https://i.imgur.com/XuhuQFq.png

// Service: https://www.elastic.co/apm
// Node module: https://github.com/elastic/apm-agent-nodejs
// Prisma: https://www.prisma.io/

// Using "@prisma/client": "dev"
// Thanks to https://github.com/prisma/prisma/pull/2902

const apmPatchPrisma = (
  prisma: PrismaClient<any, never>,
  apm: any /*Agent*/,
) => {
  // "as any" because these hooks are not available in the TypeScript types yet
  (prisma as any).$use('all', async (params, next) => {
    const name = `${params.model}.${params.action}`;
    const type = 'db';
    const subType = 'prisma';
    const action = 'query';

    const apmSpan = apm.startSpan(name, type, subType, action);
    const result = await next(params);
    apmSpan && apmSpan.end();

    return result;
  });
};

export default apmPatchPrisma;
