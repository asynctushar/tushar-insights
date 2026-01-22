"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const navItems = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const Navbar = () => {
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang");
    const pathname = usePathname();

    return (
        <div className='flex items-center gap-4'>
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={`${item.href}${lang ? `?lang=${lang}` : ""}`}
                    className={`${pathname === item.href
                        ? "font-medium"
                        : "font-normal"
                        }`}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
};

export default Navbar;