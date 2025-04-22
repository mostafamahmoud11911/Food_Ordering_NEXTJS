import React from 'react'
import MenuItem from './Menu-item'
import { ProductWithRelations } from '@/types/product'
import { gtCurrentLocale } from '@/lib/getCurrentLocaleFromServer';
import { getTrans } from '@/lib/translate';

export default async function Menu({ items }: { items: ProductWithRelations[] }) {
        const locale = await gtCurrentLocale();
        const translation = await getTrans(locale);

    return items.length > 0 ? (
        <ul className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {items.map((item) => (
                <MenuItem key={item.id} item={item} />
            ))}
        </ul>
    ) : <p className='text-accent text-center'>{translation?.noProductsFound}</p>
}
