import React from 'react'
import MainHeading from '../main-heading'
import { Routes } from '@/constants/enums'
import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer';
import { getTrans } from '@/lib/translate';

export default async function ContactPage() {
    const locale = await gtCurrentLocale();
    const contact = await getTrans(locale);

    return (
        <section className='section-gap' id={Routes.CONTACT}>
            <div className='container text-center'>
                <MainHeading
                    subTitle={contact?.home.contact['Don\'tHesitate']}
                    title={contact?.home.contact.contactUs}
                />
                <div className='mt-8'>
                    <a className='text-4xl underline text-accent' href='tel:+2012121212'>
                        +971566257513
                    </a>
                </div>
            </div>
        </section>
    )
}
