import { Injectable } from "@angular/core";
import { CategoryStorageRepository } from "../../data/repositories/categories-storage.repository";
import { Category } from "../models/category.model";

@Injectable({
    providedIn: "root"
})
export class GetCategoriesUseCase {
    constructor(private categoryRepository: CategoryStorageRepository) {}

    async execute(): Promise<Category[]> {
        return await this.categoryRepository.getAllCategories();
    }
}
