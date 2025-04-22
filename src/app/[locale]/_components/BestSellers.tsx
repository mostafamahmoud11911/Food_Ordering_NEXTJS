import MainHeading from '@/components/main-heading'
import Menu from '@/components/menu'
import React from 'react'
import { getBestSellers } from "@/server/db/products";
import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer';
import { getTrans } from '@/lib/translate';

export default async function BestSellers() {
    const bestSellers = await getBestSellers(3)

    const locale = await gtCurrentLocale();
    const translation = await getTrans(locale);
    const best = translation?.home;
    return (
        <section className='section-gap'>
            <main className='container'>
                <div className='text-center mb-4'>
                    <MainHeading
                        subTitle={best?.bestSeller?.checkOut}
                        title={best?.bestSeller.OurBestSellers}
                    />
                </div>
                <Menu items={bestSellers} />
            </main>
        </section>
    )
}
