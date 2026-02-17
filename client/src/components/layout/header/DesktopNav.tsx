"use client";

import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { linkGenerator, normalizePathname } from '@/lib/blog';
import { getLangFromLocale } from '@/lib/i18n';

type LocaleParams = {
    locale?: string[];
};

const navItems = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const DesktopNav = () => {
    const pathname = usePathname();
    const { locale } = useParams() as LocaleParams;
    const lang = getLangFromLocale(locale) || "en";

    const normalizedPath = normalizePathname(pathname, lang);

    return (
        <nav className="flex items-center gap-1">
            {navItems.map((item) => {
                const isActive =
                    item.href === "/"
                        ? normalizedPath === "/"
                        : normalizedPath.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={linkGenerator(item.href, lang)}
                        className={cn(
                            "px-4 py-2 text-sm rounded-xs font-medium transition-colors",
                            isActive
                                ? "bg-primary-foreground/20"
                                : ""
                        )}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default DesktopNav;