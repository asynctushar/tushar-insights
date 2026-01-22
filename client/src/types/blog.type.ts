import { Comment } from "./comment.type";
import { User } from "./user.type";

interface Cover {
    url: string;
    name: string;
    width: number;
    height: number;
    ext: number;
    alternativeText: string | null;
}



export interface Category {
    title: string;
    documentId: string;
    id: string;
    locale: 'en' | 'bn';
}

export interface Blog {
    id: string;
    documentId: string;
    title: string;
    slug: string;
    desc: string;
    cover: Cover;
    category: Category;
    comments: Comment[];
    user: User;
    createdAt: Date;
    locale: 'en' | 'bn';
}

