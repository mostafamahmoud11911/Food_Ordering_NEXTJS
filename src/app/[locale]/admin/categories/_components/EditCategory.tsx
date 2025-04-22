"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Languages } from '@/constants/enums'
import { Translations } from '@/types/translations'
import { Category } from '@prisma/client'
import { EditIcon, Loader } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useActionState, useEffect, useState } from 'react'
import { updateCategory } from '../_action/category'
import { ValidationErrors } from '@/validations/auth'
import { toast } from '@/hooks/use-toast'

export default function EditCategory({ translations, category }: { translations: Translations, category: Category }) {
    const [open, setOpen] = useState(false);
    const { locale } = useParams();
    const initailState: {
        message?: string | null,
        status?: number | null,
        error?: ValidationErrors | null
    } = {
        message: "",
        status: null,
        error: {}
    }
    const [state, action, pending] = useActionState(updateCategory.bind(null, category.id), initailState);

    useEffect(() => {
        if (state.message) {
          toast({
            title: state.message,
            className: state.status === 200 ? "text-green-400" : "text-destructive",
          });
        }
        if(state.message) {
            setOpen(false)
        }
      }, [state.message, state.status, open]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <EditIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle
                        className={
                            locale === Languages.ARABIC ? "!text-right" : "!text-left"
                        }
                    >
                        {translations.admin.categories.form.editName}
                    </DialogTitle>
                </DialogHeader>
                <form action={action} className="pt-4">
                    <div className="flex items-center gap-4">
                        <Label htmlFor="category-name">
                            {translations.admin.categories.form.name.label}
                        </Label>
                        <div className="flex-1 relative">
                            <Input
                                type="text"
                                id="categoryName"
                                name="categoryName"
                                defaultValue={category.name}
                                placeholder={
                                    translations.admin.categories.form.name.placeholder
                                }
                            />
                            {state.error?.categoryName && (
                                <p className="text-sm text-destructive absolute top-12">
                                    {state.error?.categoryName}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-10">
                        <Button type="submit" disabled={pending}>
                            {pending ? <Loader /> : translations.save}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
