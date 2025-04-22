import React from 'react'
import Form from '../_components/Form'
import { Locale } from '@/i18n.config'
import { getTrans } from '@/lib/translate'
import { getCategories } from '@/server/db/categories';
import { getServerSession } from 'next-auth';
import { options } from '@/server/auth';
import { Pages, Routes } from '@/constants/enums';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function NewProduct({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const session = await getServerSession(options);

  const categories = await getCategories();
  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }
  if (!categories || categories.length === 0) {
    redirect(`/${locale}/${Routes.ADMIN}/${Pages.CATEGORIES}`);
  }

  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <Form translations={translations!} categories={categories} />
        </div>
      </section>
    </main>
  )
}
