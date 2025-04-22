import EditUserForm from '@/components/EditUserForm'
import { Pages, Routes } from '@/constants/enums';
import { Locale } from '@/i18n.config'
import { getTrans } from '@/lib/translate';
import { getUser } from '@/server/db/user';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function UserEdit({params}: {params: Promise<{locale: Locale, userId: string}>}) {
  
    const { locale, userId } = await params;
    const translations = await getTrans(locale);
    const user = await getUser(userId);
    if (!user) {
      redirect(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    }
  
    return (
    <main>
      <section className="section-gap">
        <div className="container">
          <EditUserForm translations={translations!} user={user} />
        </div>
      </section>
    </main>
  )
}
