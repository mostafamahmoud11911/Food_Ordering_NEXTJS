import React from 'react'
import Link from '../link'
import { Routes } from '@/constants/enums'
import Navbar from './Navbar'
import CartButton from './CartButton'
import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer'
import { getTrans } from '@/lib/translate'
import LanguageSwitch from './LanguageSwitch'
import AuthButton from './auth-buttons'
import { getServerSession } from 'next-auth'
import { options } from '@/server/auth'


export default async function Header() {
    const locale = await gtCurrentLocale();
    const translate = await getTrans(locale);
    const initialSession = await getServerSession(options)
    return (
        <header className='py-4 md:py-6'>
            <div className='container flex items-center  justify-between gap-6 lg:gap-10'>
                <Link href={`/${locale}/${Routes.ROOT}`} className='text-primary font-semibold text-2xl'>{translate?.logo}</Link>
                <Navbar translate={translate!} initialSession={initialSession}/>
                <div className='flex items-center flex-1 justify-end'>
                    <div className='hidden lg:flex lg:items-center lg:gap-6'>
                        <AuthButton translate={translate!} initialSession={initialSession}/>
                        <LanguageSwitch />
                    </div>
                    <CartButton />
                </div>
            </div>
        </header>
    )
}
