'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageToggle = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentLang = searchParams.get('lang') || 'en';
    const pathname = usePathname();

    const changeLang = (lang: string) => {
        const params = new URLSearchParams(searchParams);
        if (lang === "bn") {
            params.set('lang', lang);
        } else {
            params.delete('lang');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" className='outline-none uppercase' size="icon">
                    {currentLang}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLang("en")}>
                    EN
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLang("bn")}>
                    BN
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageToggle;