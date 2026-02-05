'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { useParams } from 'next/navigation';
import { linkGenerator } from '@/lib/blog';
import { getLangFromLocale } from '@/lib/i18n';

type LocaleParams = {
    locale?: string[];
};

const Logo = () => {
    const { locale } = useParams() as LocaleParams;
    const lang = getLangFromLocale(locale) || "en";

    return (
        <Link
            href={linkGenerator("/", lang)}
            className="flex items-center gap-2 font-semibold text-lg transition-opacity"
        >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline-block">Tushar Insights</span>
        </Link>
    );
};

export default Logo;