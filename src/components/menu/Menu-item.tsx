import { formatPrice } from '@/lib/formatters'
import Image from 'next/image'
import React from 'react'
import AddToCartButton from './AddToCartButton'
import { ProductWithRelations } from '@/types/product'


export default function MenuItem({ item }: { item: ProductWithRelations }) {
    return (
        <li className="p-6 rounded-lg text-center
        group hover:bg-white hover:shadow-md hover:shadow-black/25 transition-all">
            <div className='relative w-48 h-48 mx-auto'>
                <Image src={item.image} alt={item.name} className='object-cover' fill />
            </div>
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-xl my-3">{item.name}</h4>
                <strong className="text-accent">
                    {formatPrice(item.basePrice)}
                </strong>
            </div>
            <p className="text-gray-500 text-sm line-clamp-3">{item.description}</p>
            <AddToCartButton item={item} />
        </li>
    )
}
