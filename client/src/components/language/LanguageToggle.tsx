'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'bn', label: 'বাংলা', flag: '🇧🇩' },
];

const LanguageToggle = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentLang = searchParams.get('lang') || 'en';
    const pathname = usePathname();

    const changeLang = (lang: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (lang === "bn") {
            params.set('lang', lang);
        } else {
            params.delete('lang');
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" size="icon" className="relative hover:bg-primary-foreground/20">
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-2 space-y-2">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLang(lang.code)}
                        className={cn(
                            "cursor-pointer focus:bg-inherit",
                            currentLang === lang.code && "bg-accent focus:bg-accent"
                        )}
                    >
                        <span className="mr-2">{lang.flag}</span>
                        <span>{lang.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageToggle;