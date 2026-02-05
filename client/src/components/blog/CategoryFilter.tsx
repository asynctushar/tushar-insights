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

        // If lang is "bn", put it in the path
        const path = lang === "bn" ? `/blogs/bn` : "/blogs";
        return `${path}${params.toString() ? `?${params.toString()}` : ""}`;
    };


    return (
        <div className="flex flex-wrap gap-2">
            <Button
                asChild
                variant={!currentCategory ? "default" : "outline"}
                className="border"
            >
                <Link href={createUrl()}>
                    {lang === "bn" ? "সব" : "All"}
                </Link>
            </Button>
            {categories.map((category) => (
                <Button
                    key={category.documentId}
                    asChild
                    variant={currentCategory === category.documentId ? "default" : "outline"}
                    className="border"
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