"use client"
import FormFields from '@/components/form-fields/form-fields';
import { Button } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import { toast } from '@/hooks/use-toast';
import useFormFields from '@/hooks/useFormFields'
import { signup } from '@/server/_action/auth';
import { IFormField } from '@/types/app';
import { Translations } from '@/types/translations'
import { ValidationErrors } from '@/validations/auth';
import { Loader } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useActionState, useEffect } from 'react'

const initialState: {
    message?: string,
    error?: ValidationErrors,
    status?: number | null,
    formData?: FormData | null
} = {
    message: "",
    error: {},
    status: null,
    formData: null
}

export default function Form({ translations }: { translations: Translations }) {
    const { getFormFields } = useFormFields({ slug: Pages.Register, translations });
    const [state, action, pending] = useActionState(signup, initialState);
    const { locale } = useParams();

    const router = useRouter();
    useEffect(() => {
        if (state.status && state.message) {
            toast({
                title: state.message,
                className: state.status === 201 ? 'text-green-400' : 'text-destructive'
            })
        }
        if (state.status === 201) {
            router.replace(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`)
        }
    }, [locale, router, state.message, state.status])
    return (
        <form action={action}>
            {getFormFields().map((field: IFormField) => {
                const fieldValue = state.formData?.get(field.name) as string;
                return (
                    <div key={field.name} className='mb-3'>
                        <FormFields {...field} error={state.error} defaultValue={fieldValue} />
                    </div>
                )
            })}
            <Button type="submit" disabled={pending} className="w-full">
                {pending ? <Loader /> : translations.auth.register.submit}
            </Button>
        </form>
    )
}
