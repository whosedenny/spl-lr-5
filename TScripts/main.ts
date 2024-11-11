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

type Validator<T> = {
    validate: (data: T) => ValidationResult;
}

type ValidationResult = {
    isValid: boolean;
    errors?: string[];
};

const articleValidator: Validator<Articel> = {
    validate(data: Articel): ValidationResult {
        const errors: string[] = [];
        if(!data.description){
            errors.push("Введіть опис");
        }
        if (!data.title || data.title.length < 1) {
            errors.push("Назва занад-то коротка. Введіть мінімум 2 символи");
        }
        if (!data.articelText) {
            errors.push("Текст не може бути порожнім");
        }
        return { isValid: errors.length === 0, errors };
    }
};


const productValidator: Validator<Product> = {
    validate(data: Product): ValidationResult {
        const errors: string[] = [];
        if (!data.description) {
            errors.push("Введіть опис");
        }
        if (!data.name || data.name.length < 2) {
            errors.push("Назва занад-то коротка. Введіть мінімум 2 символи");
        }
        if (!data.type) {
            errors.push("Введіть назву типу");
        }
        if (data.price <= 0) {
            errors.push("Ціна не може бути від'ємною");
        }
        return { isValid: errors.length === 0, errors };
    }
};

class CompositeValidator<T> implements Validator<T> {
    private validators: Validator<T>[];

    constructor(...validators: Validator<T>[]) {
        this.validators = validators;
    }

    validate(data: T): ValidationResult {
        const errors: string[] = [];
        let isValid = true;

        for (const validator of this.validators) {
            const result = validator.validate(data);
            if (!result.isValid) {
                isValid = false;
                if (result.errors) {
                    errors.push(...result.errors);
                }
            }
        }
        return { isValid, errors };
    }
}