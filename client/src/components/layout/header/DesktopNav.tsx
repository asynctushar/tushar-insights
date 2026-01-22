"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const DesktopNav = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang");

    return (
        <nav className="flex items-center gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={`${item.href}${lang ? `?lang=${lang}` : ""}`}
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