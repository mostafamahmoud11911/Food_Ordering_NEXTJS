import EditUserForm from '@/components/EditUserForm';
import { Routes } from '@/constants/enums';
import { Locale } from '@/i18n.config';
import { getTrans } from '@/lib/translate';
import { options } from '@/server/auth'
import { UserRole } from '@prisma/client';
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation';
import React from 'react'

export default async function Profile({ params }: { params: Promise<{ locale: Locale }> }) {

  const session = await getServerSession(options);
  const { locale } = (await params);
  const translations = await getTrans(locale);


  if(!session){
    return;
  }

  if (session && session.user.role === UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.ADMIN}`)
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
