"use client"
import { signOut } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button';
import { Translations } from '@/types/translations';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Pages, Routes } from '@/constants/enums';
import { Session } from 'next-auth';
import useClientSession from '@/hooks/useClientSession';

export default function AuthButton({ initialSession, translate }: { initialSession: Session | null, translate: Translations | undefined }) {
    const { data } = useClientSession(initialSession);
    const pathname = usePathname();
    const { locale } = useParams();
    const router = useRouter()


    return (
        <div>
            {
                data?.user && (
                    <div>
                        <Button onClick={() => signOut()}>
                            {translate?.navbar.signOut}
                        </Button>
                    </div>
                )
            }
            {
                !data?.user && <div className='flex items-center gap-6'>
                    <Button variant="link" onClick={() =>
                        router.push(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
                    } className={`${pathname.startsWith(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`) ? "text-primary" : "text-accent"}  hover:text-primary duration-200 transition-colors font-semibold hover:no-underline !px-0`}>{translate?.navbar.login}</Button>
                    <Button onClick={() =>
                        router.push(`/${locale}/${Routes.AUTH}/${Pages.Register}`)
                    }>{translate?.navbar.register}</Button>
                </div>
            }
        </div>
    )
}
