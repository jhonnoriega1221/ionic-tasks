import { StorageService } from "src/app/core/storage.service";
import { Injectable } from "@angular/core";
import { CategoryRepository } from "./categories.repository";
import { Category } from "../../domain/models/category.model";

@Injectable({
    providedIn: "root"
})
export class CategoryStorageRepository implements CategoryRepository {
    private readonly STORE_NAME = "categories";

    constructor(private storage: StorageService) {}

    async createCategory(category: Category): Promise<void> {
        await this.storage.set(this.STORE_NAME, category.id, category);
    }

    async getAllCategories(): Promise<Category[]> {
        const categories: Category[] = [];
        await this.storage.forEach(this.STORE_NAME, (value: Category) => {
            categories.push(value);
        });
        return categories;
    }

    async getCategoryById(id: string): Promise<Category | null> {
        return await this.storage.get<Category>(this.STORE_NAME, id);
    }

    async updateCategory(id: string, category: Category): Promise<void> {
        await this.storage.set(this.STORE_NAME, id, category);
    }

    async deleteCategory(id: string): Promise<void> {
        await this.storage.remove(this.STORE_NAME, id);
    }
}
