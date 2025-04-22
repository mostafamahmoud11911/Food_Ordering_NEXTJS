"use server";

import { Pages, Routes } from "@/constants/enums";
import { gtCurrentLocale } from "@/lib/getCurrentLocaleFromServer";
import { db } from "@/lib/prisma";
import { getTrans } from "@/lib/translate";
import { addProductSchema, updateProductSchema } from "@/validations/product";
import { Extra, Extras, Size, Sizes } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addProduct(
  args: {
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prev: unknown,
  formData: FormData
) {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);

  const result = addProductSchema(translations!).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }

  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = result.data.image as File;
  const imageUrl = Boolean(data.image)
    ? await getImageUrl(imageFile)
    : undefined;

  try {
    if (imageUrl) {
      await db.product.create({
        data: {
          ...data,
          basePrice,
          image: imageUrl,
          categoryId: args.categoryId,
          sizes: {
            createMany: {
              data: args.options.sizes.map((size) => ({
                name: size.name as Sizes,
                price: Number(size.price),
              })),
            },
          },
          extras: {
            createMany: {
              data: args.options.extras.map((extra) => ({
                name: extra.name as Extras,
                price: Number(extra.price),
              })),
            },
          },
        },
      });
      revalidatePath(`/${locale}/${Routes.MENU}`);
      revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      revalidatePath(`/${locale}`);
      return {
        message: translations?.messages.productAdded,
        status: 201,
      };
    }
    return {};
  } catch (error) {
    console.error(error);
    return {
      message: translations?.messages.unexpectedError,
      status: 500,
    };
  }
}

export async function deleteProduct(id: string) {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);

  try {
    await db.product.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);
    return {
      status: 200,
      message: translations?.messages.deleteProductSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      message: translations?.messages.unexpectedError,
      status: 500,
    };
  }
}

export async function updateProduct(
  args: {
    productId: string;
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData
) {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);

  const result = updateProductSchema(translations!).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
    };
  }

  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = result.data.image as File;
  const imageUrl = Boolean(data.image)
    ? await getImageUrl(imageFile)
    : undefined;

  try {
    const product = await db.product.findUnique({
      where: { id: args.productId },
    });

    if (!product) {
      return {
        status: 400,
        message: translations?.messages.unexpectedError,
        formData
      };
    }
    await db.product.update({
      where: {
        id: args.productId,
      },
      data: {
        ...data,
        basePrice,
        image: imageUrl,
        categoryId: args.categoryId,
      },
    });

    await db.size.deleteMany({
      where: {
        productId: args.productId,
      },
    });

    await db.size.createMany({
      data: args.options.sizes.map((size) => ({
        name: size.name as Sizes,
        price: Number(size.price),
        productId: args.productId,
      })),
    });

    await db.extra.deleteMany({
      where: {
        productId: args.productId,
      },
    });

    await db.extra.createMany({
      data: args.options.extras.map((extra) => ({
        name: extra.name as Extras,
        price: Number(extra.price),
        productId: args.productId,
      })),
    });

    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${args.productId}/${Pages.EDIT}`
    );
    return {
      status: 200,
      message: translations?.messages.updateProductSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      message: translations?.messages.unexpectedError,
      status: 500,
    };
  }
}

const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "product_images");
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASEURL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const image = (await response.json()) as { url: string };

    return image.url;
  } catch (error) {
    console.log("Error uploading file to cloudinary:", error);
  }
};
