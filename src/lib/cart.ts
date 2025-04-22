import { CartItem } from "@/redux/features/cart/cartSlice";

export const getCartQuantity = (cart: CartItem[]) => {
   return cart.reduce((quantity, item)=> item.quantity! + quantity, 0)
};


export const getItemQuantity = (cart: CartItem[], id: string)=> {
    return cart.find((item)=> item.id === id)?.quantity || 0
}

export const getSubTotal = (cart: CartItem[])=> {
    return cart.reduce((total, cartItem)=> {
        const extraTotal = cartItem.extra.reduce((sum, extra)=> sum + (extra.price || 0), 0);


        const itemTotal = cartItem.basePrice + (extraTotal || 0) + (cartItem.size.price || 0);

        return total + itemTotal * cartItem.quantity!
    }, 0)
}


export const deliveryFee = 5;
export const getTotalAmount = (cart: CartItem[])=> {
    return getSubTotal(cart) + deliveryFee
}