import Link from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { Languages, Routes } from '@/constants/enums'
import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer'
import { getTrans } from '@/lib/translate'
import { ArrowRightCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default async function Hero() {
    const locale = await gtCurrentLocale();
    const translation = await getTrans(locale);



    return (
        <section className='section-gap'>
            <div className='container grid grid-cols-1 md:grid-cols-2'>
                <div className='md:py-12'>
                    <h1 className='text-4xl font-semibold'>{translation?.home?.hero?.title}</h1>
                    <p className='text-accent my-4'>{translation?.home?.hero?.description}</p>
                    <div className='flex items-center gap-4'>
                        <Link
                            href={`/${Routes.MENU}`}
                            className={`${buttonVariants({
                                size: 'lg',
                            })} space-x-2 !px-4 !rounded-full uppercase`}
                        >
                            {translation?.home?.hero?.orderNow}
                            <ArrowRightCircle
                                className={`!w-5 !h-5  ${locale === Languages.ARABIC ? `rotate-180` : `rotate-0`}`}
                            />
                        </Link>
                        <Link
                            href={`/${Routes.ABOUT}`}
                            className='flex gap-2 items-center text-black hover:text-primary duration-200 transition-colors font-semibold'
                        >
                            {translation?.home?.hero?.learnMore}
                            <ArrowRightCircle
                                className={`!w-5 !h-5  ${locale === Languages.ARABIC ? `rotate-180` : `rotate-0`}`}
                            />
                        </Link>
                    </div>
                </div>
                <div className='relative hidden md:block'>
                    <Image
                        src='/assets/images/pizza.webp'
                        alt='Pizza'
                        fill
                        className='object-contain'
                        loading='eager'
                        priority
                    />
                </div>
            </div>
        </section>
    )
}
