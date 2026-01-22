"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lang = searchParams.get("lang");

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="default" size="icon" className="lg:hidden hover:bg-primary-foreground/20">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4">
                <nav className="flex flex-col gap-4 mt-12">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={`${item.href}${lang ? `?lang=${lang}` : ""}`}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "px-4 py-2 rounded-md text-base font-medium transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    isActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;