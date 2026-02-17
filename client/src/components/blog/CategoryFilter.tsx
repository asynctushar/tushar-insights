import { createUrl } from "@/lib/blog";
import { Category } from "@/types/blog.type";
import Link from "next/link";

interface CategoryFilterProps {
    categories: Category[];
    lang?: string;
    currentCategory?: string;
}

const CategoryFilter = ({ categories, lang = "en", currentCategory }: CategoryFilterProps) => {

    return (
        <div className="flex flex-wrap gap-3 p-1">
            <Link
                href={createUrl(lang)}
                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 border border-primary/20 ${!currentCategory
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
            >
                {lang === "bn" ? "সব" : "All"}
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.documentId}
                    href={createUrl(lang, category.documentId)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 border border-primary/20 ${currentCategory === category.documentId
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                >
                    {category.title}
                </Link>
            ))}
        </div>
    );
};

export default CategoryFilter;