import { Injectable, signal } from "@angular/core";
import { CreateCategoryUseCase } from "../../domain/usecases/create-category.usecase";
import { DeleteCategoryUseCase } from "../../domain/usecases/delete-category.usecase";
import { GetCategoriesUseCase } from "../../domain/usecases/get-categories.usecase";
import { UpdateCategoryUseCase } from "../../domain/usecases/update-category.usecase";
import { Category } from "../../domain/models/category.model";

@Injectable({
    providedIn: "root"
})
export class CategoryFacadeService {
    categories = signal<Category[]>([]);

    constructor(
        private createCategoryUseCase: CreateCategoryUseCase,
        private getAllCategoriesUseCase: GetCategoriesUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase,
        private updateCategoryUseCase: UpdateCategoryUseCase
    ) {}

    async loadAll() {
        const categories = await this.getAllCategoriesUseCase.execute();
        this.categories.set(categories);
    }

    async create(data: Omit<Category, "id" | "createdAt" | "updatedAt">) {
        const newCategory = await this.createCategoryUseCase.execute(data);
        this.categories.update((t) => [newCategory, ...t]);
        return newCategory;
    }

    async update(category: Category) {
        await this.updateCategoryUseCase.execute(category);
        this.categories.update((list) => list.map((t) => (t.id === category.id ? category : t)));
    }

    async remove(categoryId: string) {
        await this.deleteCategoryUseCase.execute(categoryId);
        this.categories.update((list) => list.filter((c) => c.id !== categoryId));
    }
}
