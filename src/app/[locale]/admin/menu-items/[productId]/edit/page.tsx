import { Pages, Routes } from '@/constants/enums';
import { Locale } from '@/i18n.config';
import { getProduct, getProducts } from '@/server/db/products'
import { redirect } from 'next/navigation';
import React from 'react'
import Form from '../../_components/Form';
import { getTrans } from '@/lib/translate';
import { getCategories } from '@/server/db/categories';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map(product => ({ productId: product.id }))
}


export default async function EditProduct({ params }: { params: Promise<{ locale: Locale, productId: string }> }) {

  const { locale, productId } = (await params);
  const translations = await getTrans(locale);
  const product = await getProduct(productId);
  const category = await getCategories()
  if(!product) {
    redirect(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
  }




  return (
    <main>
      <section>
        <div className='container'>
          <Form translations={translations!} product={product} categories={category}/>
        </div>
      </section>
    </main>
  )
}
