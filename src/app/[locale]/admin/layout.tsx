import React from 'react'
import AdminTabs from './_components/AdminTabs/AdminTabs'
import { Locale } from '@/i18n.config'
import { getTrans } from '@/lib/translate';

export default async function layout({ children, params }: { children: React.ReactNode, params: Promise<{locale: Locale}> }) {
  const {locale} = await params;
  const translations = await getTrans(locale);


  return (
    <div>
      <AdminTabs translations={translations!}/>
      {children}
    </div>
  )
}
