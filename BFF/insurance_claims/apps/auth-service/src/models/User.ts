export interface User {

    id: string;

    firstName: string;

    lastName: string;

    email: string;

    password: string;

    phone?: string;

    role: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;
}