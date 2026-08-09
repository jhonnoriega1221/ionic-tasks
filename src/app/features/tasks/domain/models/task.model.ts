export interface Task {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    order: number;
}
