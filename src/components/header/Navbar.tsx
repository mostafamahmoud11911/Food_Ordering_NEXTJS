"use client"
import React, { useState } from 'react'
import Link from '../link';
import { Routes } from '@/constants/enums';
import { Button } from '../ui/button';
import { Menu, XIcon } from "lucide-react";
import { Translations } from '@/types/translations';
import { useParams, usePathname } from 'next/navigation';
import AuthButton from './auth-buttons';
import LanguageSwitch from './LanguageSwitch';
import { Session } from 'next-auth';
import useClientSession from '@/hooks/useClientSession';
import { UserRole } from '@prisma/client';


export default function Navbar({ initialSession, translate }: { initialSession: Session | null, translate: Translations }) {

    const { locale } = useParams();
    const pathname = usePathname();
    const session = useClientSession(initialSession);

    const [openMenu, setOpenMenu] = useState(false)
    const links = [
        {
            id: crypto.randomUUID(),
            title: translate?.navbar.menu,
            href: Routes.MENU,
        },
        {
            id: crypto.randomUUID(),
            title: translate?.navbar.about,
            href: Routes.ABOUT,
        },
        {
            id: crypto.randomUUID(),
            title: translate?.navbar.contact,
            href: Routes.CONTACT,
        }
    ];

    const isAdmin = session.data?.user.role === UserRole.ADMIN;
    return (
        <nav className='order-last lg:order-none'>
            <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                onClick={() => setOpenMenu(true)}
            >
                <Menu className="!w-6 !h-6" />
            </Button>
            <ul className={`fixed ${openMenu ? "left-0 z-50" : "-left-full"
                } lg:static top-0 px-10 py-20 lg:p-0 bg-background lg:bg-transparent transition-all duration-200 h-full lg:h-auto w-full lg:w-auto flex flex-col lg:flex-row items-start lg:items-center gap-10`}>
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-10 right-10 lg:hidden"
                    onClick={() => setOpenMenu(false)}
                >
                    <XIcon className="!w-6 !h-6" />
                </Button>
                {links.map((link) => (
                    <li key={link.id} onClick={() => setOpenMenu(false)}>

                        <Link href={`/${locale}/${link.href}`} className={`${pathname.startsWith(`/${locale}/${link.href}`) ? "text-primary" : "text-accent"} hover:text-primary duration-200 transition-colors font-semibold`}>{link.title}</Link>
                    </li>
                ))}
                {session.data?.user && (
                    <li>
                        <Link
                            href={
                                isAdmin
                                    ? `/${locale}/${Routes.ADMIN}`
                                    : `/${locale}/${Routes.PROFILE}`
                            }
                            onClick={() => setOpenMenu(false)}
                            className={`${pathname.startsWith(
                                isAdmin
                                    ? `/${locale}/${Routes.ADMIN}`
                                    : `/${locale}/${Routes.PROFILE}`
                            )
                                    ? "text-primary"
                                    : "text-accent"
                                } hover:text-primary duration-200 transition-colors font-semibold`}
                        >
                            {isAdmin
                                ? translate?.navbar?.admin
                                : translate?.navbar?.profile}
                        </Link>
                    </li>
                )}
                <li className='lg:hidden flex flex-col gap-4'>
                    <div onClick={() => setOpenMenu(false)}>
                        <AuthButton translate={translate} initialSession={initialSession} />
                    </div>
                    <LanguageSwitch />
                </li>
            </ul>
        </nav>
    )
}
