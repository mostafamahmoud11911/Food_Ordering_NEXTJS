"use server";

import { Locale } from "@/i18n.config";
import { gtCurrentLocale } from "@/lib/getCurrentLocaleFromServer";
import { db } from "@/lib/prisma";
import { getTrans } from "@/lib/translate";
import { loginSchema, signUpSchema } from "@/validations/auth";
import bcrypt from "bcrypt";

export async function signIn(
  credentials: Record<"email" | "password", string> | undefined,
  locale: Locale
) {
  const translation = await getTrans(locale);
  if (!translation) {
    throw new Error('Translation not found');
  }
  const result = loginSchema(translation).safeParse(credentials);
  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
    };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user) {
      return {
        message: translation?.messages.userNotFound,
        status: 404,
      };
    }

    const passwordMatch = await bcrypt.compare(
      result.data.password,
      user.password
    );
    if (!passwordMatch) {
      return {
        message: translation?.messages.incorrectPassword,
        status: 401,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return {
      user: userData,
      status: 200,
      message: translation?.messages.loginSuccessful,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: translation?.messages.unexpectedError,
    };
  }
}





export async function signup(prevState: unknown, formData: FormData) {

  const locale = await gtCurrentLocale()
  const translation = await getTrans(locale);

  

  const result = signUpSchema(translation!).safeParse(Object.fromEntries(formData.entries()));

  if(result.success === false){
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
      status: 400
    }
  }


  try {
    const user = await db.user.findUnique({where: {
      email: result.data.email
    }});

    if(user) {
      return {
        message: translation?.messages.userAlreadyExists,
        status: 409,
        formData 
      }
    }

    const hashPassword = await bcrypt.hash(result.data.password, 10);

    const createdUser = await db.user.create({data: {
      name: result.data.name,
      email: result.data.email,
      password: hashPassword
    }})

    return {
      status: 201,
      message: translation?.messages.accountCreated,
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        
      }
    }
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: translation?.messages.unexpectedError,
    };
  }
}