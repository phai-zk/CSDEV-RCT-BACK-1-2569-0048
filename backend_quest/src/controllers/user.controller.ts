import { prisma } from '../db/db.js';

const getPostLists = async (c: any) => {
  const userId = c.get("jwtPayload").userId;
  try {
    const posts = await prisma.postItems.findMany({
        where: {
            owner: Number(userId),
        }
    });

    return c.json({ posts }, 200)

  } catch (error) {
    console.error("Error to get post lists:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};

export default {
  getPostLists,
};
