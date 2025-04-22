import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getBestSellers = cache(
  (limit?: number | undefined) => {
    const bestSellers = db.product.findMany({
      where: {
        orders: {
          some: {},
        },
      },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      take: limit,
      include: { extras: true, sizes: true },
    });
    return bestSellers;
  },
  ["best-sellers"],
  { revalidate: 3600 }
);

export const getProductsByCategory = cache(
  () => {
    const products = db.category.findMany({
      include: { products: { include: { extras: true, sizes: true } } },
    });
    return products;
  },
  ["products-by-category"],
  { revalidate: 3600 }
);

export const getProducts = cache(
  () => {
    const products = db.product.findMany({
      orderBy: {
        order: "asc",
      },
    });

    return products;
  },
  ["products"],
  { revalidate: 3600 }
);

export const getProduct = cache(
  (id: string) => {
    const product = db.product.findUnique({
      where: {
        id,
      },
      include: {
        extras: true,
        sizes: true,
      },
    });

    return product;
  },
  [`product-${crypto.randomUUID()}`],
  { revalidate: 3600 }
);
