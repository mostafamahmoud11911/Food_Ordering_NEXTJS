"use client"
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Languages } from '@/constants/enums'
import { Translations } from '@/types/translations'
import { Category } from '@prisma/client'
import { useParams } from 'next/navigation'
import React from 'react'

export default function SelectCategory({ categories, categoryId, setCategoryId, translations }: { categories: Category[], categoryId: string, setCategoryId: React.Dispatch<React.SetStateAction<string>>, translations: Translations }) {
    const { locale } = useParams();
    const categoryItem = categories.find((category) => category.id === categoryId)

    return (
        <>
            <Label htmlFor='categoryId' className='capitalize text-black block mb-3'>{translations.category}</Label>

            <Select name='categoryId' defaultValue={categoryId} onValueChange={(value) => {
                setCategoryId(value);
            }}>
                <SelectTrigger className={`w-48 h-10 bg-gray-100 border-none mb-4 focus:ring-0 ${locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
                    }`}>
                    <SelectValue>
                        {categoryItem?.name}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {categories.map((category) => (
                            <SelectItem key={category.id} className="hover:!bg-primary hover:!text-white !text-accent !bg-transparent" value={category.id}>{category.name}</SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}
