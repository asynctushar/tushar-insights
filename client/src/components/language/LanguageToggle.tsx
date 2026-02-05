import { useParams, usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { getLangFromLocale } from '@/lib/i18n';

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "bn", label: "বাংলা", flag: "🇧🇩" },
];

type LocaleParams = {
    locale?: string[];
};

const LanguageToggle = () => {
    const router = useRouter();
    const params = useParams() as LocaleParams;
    const { locale } = params;
    const pathname = usePathname();

    const currentLang = getLangFromLocale(locale) || "en";

    const changeLang = (lang: "en" | "bn") => {
        const segments = pathname.split("/").filter(Boolean);

        // Replace existing lang segment if present
        if (["en", "bn"].includes(segments[segments.length - 1])) {
            segments[segments.length - 1] = lang === "en" ? "" : lang;
        } else {
            if (lang !== "en") segments.push(lang); // only add "bn"
        }

        const newPath = "/" + segments.filter(Boolean).join("/");
        router.push(newPath);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" size="icon">
                    <Languages className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-2 space-y-2">
                {languages.map((l) => (
                    <DropdownMenuItem
                        key={l.code}
                        onClick={() => changeLang(l.code as "en" | "bn")}
                        className={cn(
                            "cursor-pointer focus:bg-inherit",
                            currentLang === l.code && "bg-accent focus:bg-accent"
                        )}
                    >
                        <span className="mr-2">{l.flag}</span>
                        <span>{l.label}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageToggle;
