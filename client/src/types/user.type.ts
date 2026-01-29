export interface User {
    fullName?: string;
    username: string;
    profilePic?: ProfilePic;
    email: string;
    accountStatus: string;
    id: string;
    documentId: string;
    createdAt: Date;
    role?: Role;
}

export interface Role {
    name: string;
    type: string;
    id: string;
    documentId: string;
    description: string;
    createdAt: Date;
}

export interface ProfilePic {
    id: string;
    documentId: string;
    name: string;
    width: number;
    height: number;
    url: string;
    createdAt: Date;
}