import { Blog } from "@/types/blog.type";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card } from "../ui/card";

const BlogItem = ({ blog }: { blog: Blog; }) => {
    return (
        <Card>
            <Button asChild>
                <Link href={`/blogs/${blog.slug}${blog.locale === "bn" ? `?lang=${blog.locale}` : ""}`}>
                    {blog.title}
                </Link>
            </Button>
            <p>
                {blog.desc}
            </p>
        </Card>
    );
};

export default BlogItem;