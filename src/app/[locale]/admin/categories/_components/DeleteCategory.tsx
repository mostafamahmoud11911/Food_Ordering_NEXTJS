"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Languages } from '@/constants/enums';
import { Translations } from '@/types/translations';
import { DeleteIcon, Loader } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { deleteCategory } from '../_action/category';
import { toast } from '@/hooks/use-toast';

export default function DeleteCategory({ id, translations }: { id: string, translations: Translations }) {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState<{ pending: boolean; status: number | null; message: string | undefined; }>({
        pending: false,
        status: null,
        message: "",
    });
    const { locale } = useParams();

console.log(id,"id");
    async function handleDelete() {
        try {
            setState((prev) => {
                return { ...prev, pending: true };
            });
            const res = await deleteCategory(id);
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
    }


    useEffect(() => {
        if (state.message && state.status && !state.pending) {
            toast({
                title: state.message,
                className: state.status === 200 ? "text-green-400" : "text-destructive",
            });
        }
    }, [state.pending, state.message, state.status]);

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
                    <Button type="submit" disabled={state.pending} onClick={handleDelete}>
                        {state.pending ? <Loader /> : translations.delete}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
