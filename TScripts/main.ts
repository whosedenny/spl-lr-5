interface BaseContent{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    status: 'draft' | 'published' | 'archived';
    description: string;
}

interface Articel extends BaseContent{
    title: string;
    articelText: string;
}

interface Product extends BaseContent{
    name: string;
    type: string;
    price: number;
}

type ContentOperations<T extends BaseContent> = {
    getAll: () => T[];
    getById: (id: string) => T | null;
    create: (data: Omit<T, "id" | "createdAt" | "updatedAt">) => T;
    update: (id: string, data: Partial<Omit<T, "id" | "createdAt">>) => T;
    delete: (id: string) => void;
};

type Role = 'admin' | 'editor' | 'viewer';

type Permission = {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}

type AccessControl<T extends BaseContent> = {
    [R in Role]: {
        [P in keyof T]?: Permission;
    };
};
