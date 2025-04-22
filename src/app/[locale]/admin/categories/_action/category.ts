"use server";

import { Pages, Routes } from "@/constants/enums";
import { gtCurrentLocale } from "@/lib/getCurrentLocaleFromServer";
import { db } from "@/lib/prisma";
import { getTrans } from "@/lib/translate";
import {
  addCategorySchema,
  updateCategorySchema,
} from "@/validations/category";
import { revalidatePath } from "next/cache";

export const addCategory = async (prevState: unknown, formData: FormData) => {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);

  const result = addCategorySchema(translations!).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
    };
  }

  try {
    await db.category.create({
      data: {
        name: result.data.name,
      },
    });
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
    revalidatePath(`/${locale}/${Routes.MENU}`);
    return {
      status: 201,
      message: translations?.messages.categoryAdded,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: translations?.messages.unexpectedError,
    };
  }
};

export const updateCategory = async (
  id: string,
  prevState: unknown,
  formData: FormData
) => {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);

  const result = updateCategorySchema(translations!).safeParse(Object.fromEntries(formData.entries()));

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
    };
  }


  try {
    await db.category.update({
        where: {
            id: id
        },
        data: {
            name: result.data.categoryName
        }
    });
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
    revalidatePath(`/${locale}/${Routes.MENU}`);

    return {
        status: 200,
        message: translations?.messages.updatecategorySucess,
      }
  } catch (error) {
    console.error(error);
    return {
        status: 500,
        message: translations?.messages.unexpectedError,
    }
  }
};



export const deleteCategory = async (id: string)=> {
    const locale = await gtCurrentLocale();
    const translations = await getTrans(locale);

    try {
      await db.category.delete({
        where: {
          id: id,
        },
      });
      revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
      revalidatePath(`/${locale}/${Routes.MENU}`);
      return {
        status: 200,
        message: translations?.messages.deleteCategorySucess,
      };
    } catch (error) {
      console.log(error);
      return {
        status: 500,
        message: translations?.messages.unexpectedError,
      };
    }
}
