import { User } from "./user.type";

export interface Comment {
    id: string;
    documentId: string;
    desc: string;
    type: 'normal' | "reply";
    createdAt: Date;
    replies: Comment[];
    user: User;
}