export interface User {
    fullName?: string;
    username: string;
    profilePic?: string;
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