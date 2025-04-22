"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Translations } from '@/types/translations'
import { ValidationErrors } from '@/validations/auth'
import { Loader } from 'lucide-react'
import React, { useActionState, useEffect } from 'react'
import { addCategory } from '../_action/category'
import { toast } from '@/hooks/use-toast'

export default function Form({ translations }: { translations: Translations }) {
    const initialState: {
        status?: number | null,
        message?: string,
        error?: ValidationErrors
    } = {
        status: null,
        message: "",
        error: {}
    }
    const [state, action, pending] = useActionState(addCategory, initialState);


    useEffect(()=> {
        if(state.message) {
            toast({
                title: state.message,
                className: state.status === 201 ? "text-green-400" : "text-destructive"
            })
        }
    }, [state.message, state.status])
    return (
        <form action={action}>
            <div className="space-y-2">
                <Label htmlFor="name">
                    {translations.admin.categories.form.name.label}
                </Label>
                <div className="flex items-center gap-4">
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder={translations.admin.categories.form.name.placeholder}
                    />
                    <Button type="submit" size="lg" disabled={pending}>
                        {pending ? <Loader /> : translations.create}
                    </Button>
                </div>
                {state.error?.name && (
                    <p className="text-sm text-destructive">{state.error.name}</p>
                )}
            </div>
        </form>
    )
}
