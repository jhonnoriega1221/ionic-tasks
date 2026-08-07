import { Injectable } from "@angular/core";
import { Category } from "../models/category.model";
import { CategoryStorageRepository } from "../../data/repositories/categories-storage.repository";

@Injectable({
    providedIn: "root"
})
export class UpdateCategoryUseCase {
    constructor(private categoryRepository: CategoryStorageRepository) {}

    async execute(taskData: Category): Promise<Category> {
        const categoryToUpdate: Category = {
            ...taskData,
            updatedAt: new Date()
        };

        await this.categoryRepository.updateCategory(categoryToUpdate.id, categoryToUpdate);
        return categoryToUpdate;
    }
}
