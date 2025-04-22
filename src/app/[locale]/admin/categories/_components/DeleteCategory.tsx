"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Languages } from '@/constants/enums';
import { Translations } from '@/types/translations';
import { DeleteIcon, Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react'
import { deleteCategory } from '../_action/category';
import { toast } from '@/hooks/use-toast';

export default function DeleteCategory({ id, translations }: { id: string,translations: Translations }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { locale } = useParams();


    async function handleDelete() {
        setLoading(true)
        try {
            const res = await deleteCategory(id);
            toast({
                title: res.message,
                className: "text-green-400"
            })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast({
                title: translations.admin.categories.deleteError,
                className: "text-destructive"
            })
        }finally{
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <DeleteIcon />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle
                        className={
                            `${locale === Languages.ARABIC ? "!text-right" : "!text-left"} text-red-700`
                        }
                    >
                        {translations.admin.categories.delete}
                    </DialogTitle>
                </DialogHeader>
                    <DialogFooter className="mt-10">
                        <Button type="submit" disabled={loading} onClick={handleDelete}>
                            {loading ? <Loader /> : translations.delete}
                        </Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
