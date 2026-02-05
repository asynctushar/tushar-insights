'use client';

import { Facebook, Linkedin, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLangFromLocale } from '@/lib/i18n';
import { linkGenerator } from "@/lib/blog";

const navItems = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const socials = [
    { href: "https://facebook.com", label: "Facebook", icon: Facebook },
    { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
    { href: "https://twitter.com", label: "Twitter", icon: Twitter },
    { href: "https://instagram.com", label: "Instagram", icon: Instagram },
];


type LocaleParams = {
    locale?: string[];
};


const Footer = () => {
    const { locale } = useParams() as LocaleParams;
    const lang = getLangFromLocale(locale) || "en";

    return (
        <footer className="mt-auto border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col items-center gap-6">
                    {/* Navigation Links */}
                    <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={linkGenerator(item.href, lang)}
                                className="text-base text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        {socials.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground transition-all duration-300 hover:scale-110 shadow-md"
                                    aria-label={item.label}
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            );
                        })}
                    </div>

                    {/* Copyright */}
                    <div className="text-base text-muted-foreground">
                        &copy; {new Date().getFullYear()} Tushar Insights. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;