import React from 'react'
import CartItems from './_components/CartItems'
import Checkout from './_components/Checkout'

export default function CartPage() {
    return (
        <main>
            <section className='section-gap'>
                <div className='container'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                        <CartItems />
                        <Checkout />
                    </div>
                </div>
            </section>
        </main>
    )
}
