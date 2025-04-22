/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label';
import { Translations } from '@/types/translations'
import { Extra, Extras, Size, Sizes } from '@prisma/client';
import { Plus, Trash2 } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React from 'react'
import { Languages } from '@/constants/enums';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

export enum ItemOptionsKeys {
    SIZES,
    EXTRAS
}


const sizesName = [
    Sizes.SMALL,
    Sizes.MEDIUM,
    Sizes.LARGE
];

const extrasName = [
    Extras.BACON,
    Extras.CHEESE,
    Extras.ONION,
    Extras.PEPPER,
    Extras.PEPPERONI,
    Extras.SAUCE
]


function handleOptions(setState: React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>) {
    const addOption = () => {
        setState((prev: any) => {
            return [...prev, { name: "", price: 0 }]
        })
    };
    const onChange = (e: React.ChangeEvent<HTMLInputElement>,
        index: number,
        fieldName: string) => {
        const newValue = e.target.value;
        setState((prev: any) => {
            const newSizes = [...prev];
            newSizes[index][fieldName] = newValue;
            return newSizes;
        });
    }
    const removeOption = (indexToRemove: number) => {
        setState((prev: any) => {
            return prev.filter((_: any, index: number) => index !== indexToRemove)
        })
    }

    return { addOption, onChange, removeOption }
}




export default function ItemOptions({ translations, state, setState, optionKey }: {
    translations: Translations, state: Partial<Size>[] | Partial<Extra>[], setState: React.Dispatch<React.SetStateAction<Partial<Size>[]>>
    | React.Dispatch<React.SetStateAction<Partial<Extra>[]>>, optionKey: ItemOptionsKeys
}) {
    const { addOption, onChange, removeOption } = handleOptions(setState)


    const isThereAvalibleOptions = () => {
        switch (optionKey) {
            case ItemOptionsKeys.SIZES:
                return sizesName.length > state.length;
            case ItemOptionsKeys.EXTRAS:
                return extrasName.length > state.length;
        }
    }

    return (
        <>
            {state.length > 0 && <ul>
                {state.map((item, index) => (
                    <li key={item.id} className='flex gap-2 mb-2'>
                        <div className='space-y-1 basis-1/2'>
                            <Label>name</Label>
                            <SelectName onChange={onChange} index={index} item={item} state={state} optionKey={optionKey} />
                        </div>
                        <div className='space-y-1 basis-1/2'>
                            <Label>Extra Price</Label>
                            <Input type="number" placeholder='0' value={item.price} onChange={(e) => onChange(e, index, "price")} min={0}
                                name="price" className="bg-white focus:!ring-0" />
                        </div>
                        <div className='flex items-end'>
                            <Button type='button' variant="outline" onClick={() => removeOption(index)}>
                                <Trash2 />
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>}
            {isThereAvalibleOptions() && <Button type='button' variant="outline" onClick={addOption} className='w-full hover:!text-white'>
                <Plus />
                {optionKey === ItemOptionsKeys.SIZES ? translations.admin["menu-items"].addItemSize : translations.admin["menu-items"].addExtraItem}
            </Button>}
        </>
    )
}


function SelectName({ onChange, index, item, state, optionKey }: { onChange: (e: any, index: any, fieldName: any) => void, index: number, item: Partial<Size> | Partial<Extra>, state: Partial<Size>[] | Partial<Extra>[], optionKey: ItemOptionsKeys }) {
    const { locale } = useParams();

    const getNames = () => {
        switch (optionKey) {
            case ItemOptionsKeys.SIZES:
                const filterSize = sizesName.filter(size => !state.some(z => z.name === size));
                return filterSize;
            case ItemOptionsKeys.EXTRAS:
                const filterExtra = extrasName.filter(extra => !state.some(z => z.name === extra));
                return filterExtra;
        }
    }

    return (
        <Select defaultValue={item.name ? item.name : "Select..."} onValueChange={(value) => {
            onChange({ target: { value } }, index, "name");
        }}>
            <SelectTrigger className={` bg-white border-none mb-4 focus:ring-0 ${locale === Languages.ARABIC ? "flex-row-reverse" : "flex-row"
                }`}>
                <SelectValue>
                    {item.name ? item.name : "Select..."}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className='bg-transparent border-none z-50 bg-white'>
                <SelectGroup className='bg-background text-accent z-50'>
                    {getNames().map(size => (
                        <SelectItem key={size} className='hover:!bg-primary hover:!text-white !text-accent !bg-transparent ' value={size}>{size}</SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}