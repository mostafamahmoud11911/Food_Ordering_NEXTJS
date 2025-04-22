import EditUserForm from '@/components/EditUserForm';
import { Pages, Routes } from '@/constants/enums';
import { Locale } from '@/i18n.config'
import { getTrans } from '@/lib/translate';
import { options } from '@/server/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Admin({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const session = await getServerSession(options);

  if(!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
  }

  return (
    <main>
          <section className="section-gap">
            <div className="container">
              <h1 className="text-primary text-center font-bold text-4xl italic mb-10">
                {translations?.profile.title}
              </h1>
              <EditUserForm user={session?.user} translations={translations!} />
            </div>
          </section>
        </main>
  )
}
