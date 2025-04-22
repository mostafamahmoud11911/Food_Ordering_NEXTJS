"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { formatPrice } from '@/lib/formatters'
import { Checkbox } from '../ui/checkbox'
import { ProductWithRelations } from '@/types/product'
import { Extra, Size } from '@prisma/client'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { addToCart, removeCartItem, removeItemFromCart, selectCartItems } from '@/redux/features/cart/cartSlice'
import { getItemQuantity } from '@/lib/cart'






export default function AddToCartButton({ item }: { item: ProductWithRelations }) {
    const cart = useAppSelector(selectCartItems);

    const quantity = getItemQuantity(cart, item.id)



    const dispatch = useAppDispatch();
    const defaultSize =
        cart.find((element) => element.id === item.id)?.size ||
        item.sizes.find((size) => size.name);


    const [selectedSize, setSelectedSize] = useState<Size>(defaultSize!);


    


    const defaultExtras = cart.find((extra => extra.id === item.id))?.extra || [];


    const [selectedExtras, setSelectedExtras] = useState<Extra[]>(defaultExtras!);


    let totalPrice = item.basePrice;
    if (selectedSize) {
        totalPrice += selectedSize.price;
    }
    if (selectedExtras.length > 0) {
        for (const extra of selectedExtras) {
            totalPrice += extra.price;
        }
    }

    const handleAddToCart = () => {
        dispatch(addToCart({
            id: item.id,
            name: item.name,
            basePrice: item.basePrice,
            image: item.image,
            size: selectedSize,
            extra: selectedExtras
        }))
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type='button' size="lg" className='mt-4 text-white rounded-full !px-8'>
                    <span>Add To Cart</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
                <DialogHeader className='flex items-center flex-col'>
                    <Image src={item.image} alt={item.name} className='object-cover' width={200} height={200} />
                    <DialogTitle>{item.name}</DialogTitle>
                    <DialogDescription className='text-center'>
                        {item.description}
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-10'>
                    <div className='space-y-4 text-center'>
                        <Label htmlFor='pick-size'>Pick your size</Label>
                        <PickSize sizes={item.sizes} item={item} selectedSize={selectedSize} setSelectedSize={setSelectedSize} />
                    </div>
                    <div className='space-y-4 text-center'>
                        <Label>Any Extra?</Label>
                        <Extras extras={item.extras} selectedExtras={selectedExtras} setSelectedExtras={setSelectedExtras} />
                    </div>
                </div>
                <DialogFooter>
                    {quantity === 0 ? <Button type="submit" onClick={handleAddToCart} className='w-full h-10'>Save changes {formatPrice(totalPrice)}</Button>
                        : <div className='mx-auto w-full'>
                            <ChooseQuantity quantity={quantity} item={item} selectedSize={selectedSize} selectedExtras={selectedExtras} />
                        </div>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


function PickSize({ sizes, item, selectedSize, setSelectedSize }: { sizes: Size[], item: ProductWithRelations, selectedSize: Size, setSelectedSize: React.Dispatch<React.SetStateAction<Size>> }) {

    return (
        <RadioGroup>
            {sizes.map((size) => (
                <div key={size.id} className="flex items-center space-x-2 border border-gray-100 rounded-md p-4">
                    <RadioGroupItem value={selectedSize.name} checked={selectedSize.id === size.id} onClick={() => setSelectedSize(size)} id={size.id} />
                    <Label htmlFor={size.id}>{size.name} {formatPrice(item.basePrice + size.price)}</Label>
                </div>
            ))}
        </RadioGroup>
    )
}


function Extras({ extras, selectedExtras, setSelectedExtras }: { extras: Extra[], selectedExtras: Extra[], setSelectedExtras: React.Dispatch<React.SetStateAction<Extra[]>> }) {

    const handleExtra = (extra: Extra) => {
        if (selectedExtras.find((element) => element.id === extra.id)) {
            setSelectedExtras(selectedExtras.filter((element) => element.id !== extra.id));
        } else {
            setSelectedExtras([...selectedExtras, extra]);
        }
    }


    return (
        <>
            {extras.map(extra => (
                <div key={extra.id} className="flex items-center space-x-2 border border-gray-100 rounded-md p-4">
                    <Checkbox checked={Boolean(selectedExtras.find((element) => element.id === extra.id))} onClick={() => handleExtra(extra)} id="terms" />
                    <label
                        htmlFor="terms"
                        className="text-sm text-accent font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {extra.name} {formatPrice(extra.price)}
                    </label>
                </div>
            ))}
        </>
    )
}



const ChooseQuantity = ({ quantity, item, selectedSize, selectedExtras }: { quantity: number, item: ProductWithRelations, selectedSize: Size, selectedExtras: Extra[] }) => {
    const dispatch = useAppDispatch()
    return (
        <div className='flex items-center flex-col gap-2 mt-4 w-full'>
            <div className='flex items-center justify-center gap-2'>
                <Button
                    variant='outline'
                    onClick={() => dispatch(removeCartItem({ id: item.id }))}
                >
                    -
                </Button>
                <div>
                    <span className='text-black'>{quantity} in cart</span>
                </div>
                <Button
                    variant='outline'
                    onClick={() =>
                        dispatch(
                            addToCart({
                                basePrice: item.basePrice,
                                id: item.id,
                                image: item.image,
                                name: item.name,
                                extra: selectedExtras,
                                size: selectedSize,
                            })
                        )
                    }
                >
                    +
                </Button>
            </div>
            <Button
                size='sm'
                onClick={() => dispatch(removeItemFromCart({ id: item.id }))}
            >
                Remove
            </Button>
        </div>
    )
}