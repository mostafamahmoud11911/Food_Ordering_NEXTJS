"use client"
import FormFields from '@/components/form-fields/form-fields';
import { Button } from '@/components/ui/button';
import { Pages, Routes } from '@/constants/enums';
import useFormFields from '@/hooks/useFormFields'
import { IFormField } from '@/types/app';
import { Translations } from '@/types/translations'
import { Loader } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { signIn } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';

export default function Form({ translations }: { translations: Translations }) {
    const formRef = useRef<HTMLFormElement>(null)
    const { getFormFields } = useFormFields({ slug: Pages.LOGIN, translations });
    const { locale } = useParams();
    const router = useRouter();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;
        const formData = new FormData(formRef.current);

        const data: Record<string, string> = {};

        formData.forEach((value, key) => {
            data[key] = value.toString()
        });

        try {
            setIsLoading(true);
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                const validationError = JSON.parse(res.error).validationError;
                setError(validationError);
                const responseError = JSON.parse(res.error).responseError;
                toast({
                    title: responseError,
                    className: "text-destructive",
                })

            }
            if (res?.ok) {
                toast({
                    title: translations?.messages.loginSuccessful,
                    className: "text-green-500",
                })
                router.replace(`/${locale}/${Routes.PROFILE}`)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }

    }
    return (
        <form onSubmit={onSubmit} ref={formRef}>

            <div className='font-semibold text-lg italic flex flex-col items-center'><p>Admin</p> <p>email: mm0766633@gmail.com</p> <p>password: 123456</p></div>

            {getFormFields().map((field: IFormField) => (
                <div key={field.name} className="mb-3">
                    <FormFields {...field} error={error} />
                </div>
            ))}
            <Button type="submit" className="w-full">
                {isLoading ? <Loader /> : translations.auth.login.submit}
            </Button>
        </form>
    )
}
