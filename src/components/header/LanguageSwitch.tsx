"use client"
import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Languages } from "@/constants/enums";

export default function LanguageSwitch() {

    const router = useRouter();
    const pathname = usePathname();
    const { locale } = useParams();

    const switchLanguage = (newLocale: string) => {
        const path =
            pathname?.replace(`/${locale}`, `/${newLocale}`) ?? `/${newLocale}`;
        router.push(path);
    };

    return (
        <div className="flex mx-2">
            {locale === Languages.ARABIC ? (
                <Button
                    variant="outline"
                    onClick={() => switchLanguage(Languages.ENGLISH)}
                >
                    English
                </Button>
            ) :  (
                <Button
                    variant="outline"
                    onClick={() => switchLanguage(Languages.ARABIC)}
                >
                    العربية
                </Button>
            )}
        </div>
    );
}
