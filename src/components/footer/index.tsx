import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer';
import { getTrans } from '@/lib/translate';
import React from 'react'

export default async function Footer() {
      const locale = await gtCurrentLocale();
      const translation = await getTrans(locale);
  return (
    <footer className='border-t p-8 text-center text-accent'>
      <div className='container'>
        <p>{translation?.copyRight}</p>
      </div>
    </footer>
  )
}
