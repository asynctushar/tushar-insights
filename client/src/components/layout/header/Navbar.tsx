"use client";

import { linkGenerator } from '@/lib/blog';
import { getLangFromLocale } from '@/lib/i18n';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const navItems = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

type LocaleParams = {
    locale?: string[];
};

const Navbar = () => {
    const { locale } = useParams() as LocaleParams;
    const lang = getLangFromLocale(locale) || "en";
    const pathname = usePathname();

    return (
        <div className='flex items-center gap-4'>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={linkGenerator(item.href, lang)}
                    className={`${pathname === item.href
                        ? "font-medium"
                        : "font-normal"
                        }`}
                >
                    {item.label}
                </Link>
            ))
            }
        </div >
    );
};

export default Navbar;