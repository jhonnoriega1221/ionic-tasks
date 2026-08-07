import { Injectable } from "@angular/core";
import { CategoryStorageRepository } from "../../data/repositories/categories-storage.repository";

@Injectable({
    providedIn: "root"
})
export class DeleteCategoryUseCase {
    constructor(private categoryRepository: CategoryStorageRepository) {}

    async execute(categoryId: string): Promise<void> {
        await this.categoryRepository.deleteCategory(categoryId);
    }
}
