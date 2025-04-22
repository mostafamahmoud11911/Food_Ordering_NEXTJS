"use server"
import { Pages, Routes } from "@/constants/enums";
import { gtCurrentLocale } from "@/lib/getCurrentLocaleFromServer";
import { db } from "@/lib/prisma";
import { getTrans } from "@/lib/translate";
import { revalidatePath } from "next/cache";

export const deleteUser = async (id: string) => {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);
  try {
    await db.user.delete({
      where: {
        id,
      },
    });
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${id}/${Pages.EDIT}`
    );
    return {
      status: 200,
      message: translations?.messages.deleteUserSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations?.messages.unexpectedError,
    };
  }
};
