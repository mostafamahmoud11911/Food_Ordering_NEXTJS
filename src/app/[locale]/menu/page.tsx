import Menu from '@/components/menu';
import { getProductsByCategory } from '@/server/db/products'
import React from 'react'

export default async function MenuPage() {
    const categories = await getProductsByCategory();
    return (
        <main>
            {categories.length > 0 ? (
                categories.map((category) => (
                    <section key={category.id} className="section-gap">
                        <div className="container text-center">
                            <h1 className="text-primary font-bold text-4xl italic mb-6">
                                {category.name}
                            </h1>
                            <Menu key={category.id} items={category.products} />
                        </div>
                    </section>
                ))
            ) : (
                <p className="text-accent text-center py-20">
                    No products found
                </p>
            )}
        </main>
    )
}
