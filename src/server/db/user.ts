import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getUsers = cache(
  async () => {
    const users = await db.user.findMany();
    return users;
  },
  ["users"],
  { revalidate: 3600 }
);

export const getUser = cache(
  async (id: string) => {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  },
  [`user-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);
