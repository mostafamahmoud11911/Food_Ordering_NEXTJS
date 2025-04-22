"use server";

import { Pages, Routes } from "@/constants/enums";
import { gtCurrentLocale } from "@/lib/getCurrentLocaleFromServer";
import { db } from "@/lib/prisma";
import { getTrans } from "@/lib/translate";
import { updateProfileSchema } from "@/validations/profile";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  isAdmin: boolean,
  prevState: unknown,
  formData: FormData
) => {
  const locale = await gtCurrentLocale();
  const translations = await getTrans(locale);
  const result = updateProfileSchema(translations!).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
      status: 400,
    };
  }

  const imageFile = result.data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;

  try {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user) {
      return {
        message: translations?.messages.userNotFound,
      };
    }

    await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        ...result.data,
        image: imageUrl ?? user.image,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });

    revalidatePath(`/${locale}/${Routes.PROFILE}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`
    );

    return {
      message: translations?.messages.updateProfileSucess,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations?.messages.unexpectedError,
    };
  }
};

const getImageUrl = async (imageFile: File) => {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "profile_images");
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
