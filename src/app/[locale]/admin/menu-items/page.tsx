import Link from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { Languages, Pages, Routes } from '@/constants/enums'
import { Locale } from '@/i18n.config'
import { getTrans } from '@/lib/translate'
import { getProducts } from '@/server/db/products'
import { ArrowRightCircle } from 'lucide-react'
import React from 'react'
import MenuItems from './_components/MenuItems'

export default async function MenuItem({params}: {params: Promise<{locale: Locale}>}) {

    const {locale} = await params;
    const translations = await getTrans(locale);

    const products = await getProducts();

  return (
    <main>
    <section className="section-gap">
      <div className="container">
        <Link
          href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
          className={`${buttonVariants({
            variant: "outline",
          })} !mx-auto !flex !w-80 !h-10 mb-8`}
        >
          {translations?.admin["menu-items"].createNewMenuItem}
          <ArrowRightCircle
            className={`!w-5 !h-5 ${
              locale === Languages.ARABIC ? "rotate-180 " : ""
            }`}
          />
        </Link>
        <MenuItems products={products}/>
      </div>
    </section>
  </main>
  )
}
