import { ProfilePic } from "./user.type";

export interface Policy {
    documentId: string;
    id: string;
    title: string;
    sort: string;
    desc: string;
    createdAt: Date;
}

export interface Term {
    documentId: string;
    id: string;
    title: string;
    sort: string;
    desc: string;
    createdAt: Date;
}

export interface About {
    id: string;
    documentId: string;
    name: string;
    roles: ["UI/UX Designer", "Full Stack Web Developer", "Textile Engineer"];
    biography: string;
    beyondCode: string;
    idea: string;
    goals: string;
    thankingMessage: string;
    footer: string;
    profilePic: ProfilePic;
}

