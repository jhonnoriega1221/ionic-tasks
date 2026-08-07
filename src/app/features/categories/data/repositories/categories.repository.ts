import { Category } from "../../domain/models/category.model";

export abstract class CategoryRepository {
    abstract createCategory(Category: Category): Promise<void>;
    abstract getAllCategories(): Promise<Category[]>;
    abstract getCategoryById(id: string): Promise<Category | null>;
    abstract updateCategory(id: string, category: Category): Promise<void>;
    abstract deleteCategory(id: string): Promise<void>;
}
