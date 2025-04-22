"use client"
import { InputTypes, Routes } from '@/constants/enums'
import useFormFields from '@/hooks/useFormFields'
import { Translations } from '@/types/translations'
import { Session } from 'next-auth'
import Image from 'next/image'
import React, { useActionState, useEffect, useState } from 'react'
import FormFields from '../form-fields/form-fields'
import { Button } from '../ui/button'
import Checkbox from '../form-fields/checkbox'
import { UserRole } from '@prisma/client'
import { ValidationErrors } from '@/validations/auth'
import { updateProfile } from './_actions/profile'
import { CameraIcon, Loader } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function EditUserForm({ user, translations }: { user: Session["user"], translations: Translations }) {
    const [selectedImage, setSelectedImage] = useState(user.image ?? "");
    const { getFormFields } = useFormFields({ slug: Routes.PROFILE, translations });
    const formData = new FormData();


    // return old value to input


    Object.entries(user).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== "image") {
            formData.append(key, value?.toString())
        }
    })




    const initialState: {
        message?: string;
        error?: ValidationErrors;
        status?: number | null;
        formData?: FormData | null;
    } = {
        message: "",
        error: {},
        status: null,
        formData,
    };

    const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);
    const [state, action, pending] = useActionState(updateProfile.bind(null, isAdmin), initialState);


    useEffect(() => {
        if (state && state.message && state.status && !pending) {
            toast({
                title: state.message,
                className: state.status === 200 ? "text-green-400" : "text-destructive"
            })
        }
    }, [pending, state]);

    useEffect(() => {
        setSelectedImage(user.image as string)
    }, [user.image])

    return (
        <form action={action} className='flex flex-col md:flex-row gap-10'>
            <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto">
                {selectedImage && (
                    <Image
                        src={selectedImage}
                        alt={user.name}
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
                    <UploadImage setSelectedImage={setSelectedImage} />
                </div>
            </div>

            <div className='flex-1'>
                {getFormFields().map((field) => {
                    const fieldValue = state?.formData?.get(field.name) ?? formData.get(field.name)
                    return (
                        <div key={field.name} className='mb-3'>
                            <FormFields {...field} readOnly={field.type === InputTypes.EMAIL} defaultValue={fieldValue as string} error={state?.error} />
                        </div>
                    )
                })}
                {user.role === UserRole.ADMIN && (
                    <div className="flex items-center gap-2 my-4">
                        <Checkbox
                            name="admin"
                            checked={isAdmin}
                            onClick={() => setIsAdmin(!isAdmin)}
                            label="Admin"
                        />
                    </div>
                )}
                <Button type="submit" disabled={pending} className="w-full">
                    {pending ? <Loader /> : translations.save}
                </Button>
            </div>
        </form>
    )
}





const UploadImage = ({
    setSelectedImage,
}: {
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedImage(url);
        }
    };
    return (
        <>
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
        </>
    );
};