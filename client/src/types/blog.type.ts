import { Comment } from "./comment.type";
import { User } from "./user.type";

interface Cover {
    url: string;
    name: string;
    width: number;
    height: number;
    ext: number;
    alternativeText: string | null;
    formats?: {
        thumbnail: {
            url: string;
        };
        small: {
            url: string;
        };
        medium: {
            url: string;
        };
        large: {
            url: string;
        };
    };
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
    commentsCount?: number;
    reactions?: Reaction[];
}

export interface Reaction {
    id: string;
    documentId: string;
    type: "like" | "love" | "haha" | "angry" | "sad";
    createdAt: Date;
    user?: User;
}

export interface BlogSuggestion {
    id: string;
    documentId: string;
    title: string;
    slug: string;
    desc: string;
    locale: 'en' | 'bn';
}

export interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
};

export interface Picture {

}
