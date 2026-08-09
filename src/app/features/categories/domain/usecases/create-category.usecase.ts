import { Injectable } from "@angular/core";
import { CategoryStorageRepository } from "../../data/repositories/categories-storage.repository";
import { Category } from "../models/category.model";
import { DEFAULT_CATEGORY_COLOR } from "../../presentation/constants/category-colors";

@Injectable({
    providedIn: "root"
})
export class CreateCategoryUseCase {
    constructor(private categoryRepository: CategoryStorageRepository) {}

    async execute(
        categoryData: Omit<Category, "id" | "completed" | "createdAt" | "updatedAt">
    ): Promise<Category> {
        const newCategory: Category = {
            ...categoryData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await this.categoryRepository.createCategory(newCategory);
        return newCategory;
    }
}
