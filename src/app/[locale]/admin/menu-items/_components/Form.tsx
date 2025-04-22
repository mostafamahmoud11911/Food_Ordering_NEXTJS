"use client"
import FormFields from '@/components/form-fields/form-fields'
import { Button, buttonVariants } from '@/components/ui/button'
import { Pages, Routes } from '@/constants/enums'
import useFormFields from '@/hooks/useFormFields'
import { Translations } from '@/types/translations'
import { Category, Extra, Product, Size } from '@prisma/client'
import { CameraIcon, Loader } from 'lucide-react'
import Image from 'next/image'
import React, { useActionState, useEffect, useState } from 'react'
import SelectCategory from './SelectCategory'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import ItemOptions, { ItemOptionsKeys } from './ItemOptions'
import Link from '@/components/link'
import { useParams } from 'next/navigation'
import { addProduct, deleteProduct, updateProduct } from '../_actions/product'
import { ValidationErrors } from '@/validations/auth'
import { toast } from '@/hooks/use-toast'
import { ProductWithRelations } from '@/types/product'



export default function Form({ translations, product, categories }: { translations: Translations, product?: ProductWithRelations, categories: Category[] }) {
  const [selectedImage, setSelectedImage] = useState(product ? product.image : "");
  const [categoryId, setCategoryId] = useState(product ? product.categoryId : categories[0].id);
  const [sizes, setSizes] = useState<Partial<Size>[]>(product ? product.sizes : []);
  const [extras, setExtras] = useState<Partial<Extra>[]>(product ? product.extras : []);
  const { getFormFields } = useFormFields({ slug: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`, translations })


  const formData = new FormData();

  Object.entries(product ? product : {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString())
    }
  })


  const initialState: {
    message?: string,
    status?: number | null;
    formData?: FormData | null
    error?: ValidationErrors
  } = {
    message: "",
    status: null,
    formData: null,
    error: {}
  }

  const [state, action, pending] = useActionState( product ? updateProduct.bind(null, { categoryId, productId: product?.id as string, options: { sizes, extras } }) : addProduct.bind(null, { categoryId, options: { sizes, extras } }), initialState)

  useEffect(() => {
    if (state?.message && state.status && !pending) {
      toast({
        title: state.message,
        className: state.status === 201 || state.status === 200 ? "text-green-400" : "text-destructive"
      })
    }
  }, [pending, state?.message, state?.status])
  return (
    <form action={action} className='flex flex-col md:flex-row gap-10'>
      <div>
        <UploadImage selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
        {state?.error?.image && (
          <p className='text-sm text-destructive text-center mt-4 font-medium'>{state.error?.image}</p>
        )}
      </div>
      <div className='flex-1'>
        {getFormFields().map((field) => {
          const fieldValue = state?.formData?.get(field.name) ?? formData.get(field.name);

          return (
            <div key={field.id} className='mb-3'>
              <FormFields {...field} error={state?.error} defaultValue={fieldValue as string} />
            </div>
          )
        })}
        <SelectCategory categories={categories} categoryId={categoryId} setCategoryId={setCategoryId} translations={translations} />
        <AddSizes translations={translations} sizes={sizes} setState={setSizes} />
        <AddExtras translations={translations} extras={extras} setState={setExtras} />
        <FormAction translations={translations} product={product} pending={pending} />
      </div>
    </form>
  )
}


function UploadImage({ selectedImage, setSelectedImage }: { selectedImage: string, setSelectedImage: React.Dispatch<React.SetStateAction<string>> }) {


  function handleImageChange(e: React.ChangeEvent<HTMLInputElement> | undefined) {
    const file = e?.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url)
    }
  }


  return <div className="group mx-auto md:mx-0 relative w-[200px] h-[200px] overflow-hidden rounded-full">
    {selectedImage && (
      <Image
        src={selectedImage}
        alt="Add Product Image"
        width={200}
        height={200}
        className="rounded-full object-cover"
      />
    )}
    <div
      className={`${selectedImage
        ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
        : ""
        } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id="image-upload"
        onChange={handleImageChange}
        name="image"
      />
      <label
        htmlFor="image-upload"
        className="border rounded-full w-[200px] h-[200px] element-center cursor-pointer"
      >
        <CameraIcon className="!w-8 !h-8 text-accent" />
      </label>
    </div>
  </div>
}



function AddSizes({ translations, sizes, setState }: { translations: Translations, sizes: Partial<Size>[], setState: React.Dispatch<React.SetStateAction<Partial<Size>[]>> }) {
  return (
    <Accordion type="single" className='bg-gray-100 rounded-md px-4 w-80 mb-4' collapsible>
      <AccordionItem value="item-1" className='border-none'>
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">{translations.sizes}</AccordionTrigger>
        <AccordionContent>
          <ItemOptions translations={translations} optionKey={ItemOptionsKeys.SIZES} state={sizes} setState={setState} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>

  )
}

function AddExtras({ translations, extras, setState }: { translations: Translations, extras: Partial<Extra>[], setState: React.Dispatch<React.SetStateAction<Partial<Extra>[]>> }) {
  return (
    <Accordion type="single" className='bg-gray-100 rounded-md px-4 w-80 mb-4' collapsible>
      <AccordionItem value="item-1" className='border-none'>
        <AccordionTrigger className="text-black text-base font-medium hover:no-underline">{translations.extrasIngredients}</AccordionTrigger>
        <AccordionContent>
          <ItemOptions translations={translations} optionKey={ItemOptionsKeys.EXTRAS} state={extras} setState={setState} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>

  )
}



function FormAction({ translations, product, pending }: { translations: Translations, product?: Product, pending: boolean }) {
  const { locale } = useParams();
  const [state, setState] = useState<{ message?: string, status: number | null, pending: boolean }>({ message: "", status: null, pending: false })

  const handleDelete = async (id: string) => {
    try {
      setState((prev) => {
        return { ...prev, pending: true };
      });
      const res = await deleteProduct(id);
      setState((prev) => {
        return { ...prev, status: res.status, message: res.message };
      });
    } catch (error) {
      console.log(error);
    } finally {
      setState((prev) => {
        return { ...prev, pending: false };
      });
    }
  };
  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast({
        title: state.message,
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });
    }
  }, [pending, state.message, state.status]);


  return (
    <>
      <div
        className={`${product ? "grid grid-cols-2" : "flex flex-col"} gap-4`}
      >
        <Button type="submit" disabled={pending}>
          {pending ? (
            <Loader />
          ) : product ? (
            translations.save
          ) : (
            translations.create
          )}
        </Button>
        {product && (
          <Button
            variant="outline"
            disabled={state.pending}
            onClick={() => handleDelete(product.id)}
          >
            {state.pending ? <Loader /> : translations.delete}
          </Button>
        )}
      </div>

      <Link
        href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`}
        className={`w-full mt-4 ${buttonVariants({ variant: "outline" })}`}
      >
        {translations.cancel}
      </Link>
    </>
  )
}