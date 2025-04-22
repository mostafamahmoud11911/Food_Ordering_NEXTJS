import { Locale } from '@/i18n.config';
import { getTrans } from '@/lib/translate';
import { getCategories } from '@/server/db/categories'
import React from 'react'
import Form from './_components/Form';
import CategoriesItem from './_components/CategoriesItem';

export default async function Categories({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const translations = await getTrans(locale);


    const categories = await getCategories();

    return (
        <main>
            <section className='section-gap'>
                <div className="container">
                    <div>
                        <Form translations={translations!} />
                        {categories.length > 0 ? <ul className="flex flex-col gap-4 mt-3">
                            {categories.map((category) => (
                                <CategoriesItem key={category.id} category={category} translations={translations!}/>
                            ))}
                        </ul> : <p className='text-accent text-center py-10'>{translations?.noCategoriesFound}</p>}
                    </div>
                </div>
            </section>
        </main>
    )
}
