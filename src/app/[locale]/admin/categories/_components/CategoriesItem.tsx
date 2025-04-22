import { Translations } from '@/types/translations'
import { Category } from '@prisma/client'
import React from 'react'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory'

export default function CategoriesItem({ category, translations }: { category: Category, translations: Translations }) {
    return (
        <li className="bg-gray-300 p-4 rounded-md flex justify-between">
            <h3 className="text-black font-medium text-lg flex-1">{category.name}</h3>
            <div className="flex items-center gap-2">
                <EditCategory translations={translations} category={category} />
                <DeleteCategory translations={translations} id={category.id} />
            </div>
        </li>
    )
}
