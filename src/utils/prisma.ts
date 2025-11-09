import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

// import { PrismaClient } from '@prisma/client'

// const prismaClientSingleton = () => {
//   return new PrismaClient()
// }

// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;

// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

// export default prisma

// if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
// utils/prisma.ts
// utils/prisma.ts
// utils/prisma.ts
// import { PrismaClient } from '@prisma/client';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { Pool } from '@neondatabase/serverless';

// // Fix global type
// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const prisma = global.prisma ?? (() => {
//   if (process.env.NODE_ENV === 'production') {
//     // EDGE RUNTIME — WORKS WITH AIVEN
//     const connectionString = process.env.DATABASE_URL!;
//     if (!connectionString) throw new Error('DATABASE_URL missing');

//     const pool = new Pool({ connectionString });

//     // THIS LINE FIXES THE ERROR
//     const adapter = new PrismaNeon(pool) as any;

//     const client = new PrismaClient({ adapter });
//     return client;
//   }

//   // DEVELOPMENT
//   if (!global.prisma) {
//     global.prisma = new PrismaClient();
//   }
//   return global.prisma;
// })();

// if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// export default prisma;
// utils/prisma.ts
// import { PrismaClient } from '@prisma/client';
// import { PrismaNeon } from '@prisma/adapter-neon';
// import { Pool } from '@neondatabase/serverless';

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// // ALWAYS USE ADAPTER (dev + prod)
// const prisma = global.prisma ?? (() => {
//   const connectionString = process.env.DATABASE_URL;
//   if (!connectionString) throw new Error('DATABASE_URL missing');

//   const pool = new Pool({ connectionString });
//   const adapter = new PrismaNeon(pool);
//   return new PrismaClient({ adapter });
// })();

// if (process.env.NODE_ENV !== 'production') {
//   global.prisma = prisma;
// }

// export default prisma;