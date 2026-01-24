import { Button } from "@/components/ui/button";
import { Category } from "@/types/blog.type";
import Link from "next/link";

interface CategoryFilterProps {
    categories: Category[];
    lang?: string;
    currentCategory?: string;
}

const CategoryFilter = ({ categories, lang, currentCategory }: CategoryFilterProps) => {

    const createUrl = (categoryId?: string) => {
        const params = new URLSearchParams();
        if (categoryId) params.set("category", categoryId);
        if (lang) params.set("lang", lang);
        return `/blogs${params.toString() ? `?${params.toString()}` : ""}`;
    };

    return (
        <div className="flex flex-wrap gap-2">
            <Button
                asChild
                variant={!currentCategory ? "default" : "outline"}
            >
                <Link href={createUrl()}>
                    All
                </Link>
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.documentId}
                    asChild
                    variant={currentCategory === category.documentId ? "default" : "outline"}
                >
                    <Link href={createUrl(category.documentId)}>
                        {category.title}
                    </Link>
                </Button>
            ))}
        </div>
    );
};

export default CategoryFilter;