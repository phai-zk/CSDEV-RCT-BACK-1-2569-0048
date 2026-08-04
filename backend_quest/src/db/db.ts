import { PrismaClient } from './generated/client'
import { PrismaPg } from '@prisma/adapter-pg';
// import { PrismaNeon } from '@prisma/adapter-neon'

// const adapter = new PrismaNeon({
//   connectionString: process.env.DATABASE_URL!,
// })

const adapter =new PrismaPg({ connectionString: process.env.DATABASE_URL })

// export const prisma = new PrismaClient();
export const prisma = new PrismaClient({ adapter })

