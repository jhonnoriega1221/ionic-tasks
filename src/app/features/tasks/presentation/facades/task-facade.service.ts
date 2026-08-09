import { Injectable, signal } from "@angular/core";
import { CreateTaskUseCase } from "../../domain/usecases/create-task.usecase";
import { UpdateTaskUseCase } from "../../domain/usecases/update-task.usecase";
import { GetTasksUseCase } from "../../domain/usecases/get-tasks.usecase";
import { GetCategoriesUseCase } from "src/app/features/categories/domain/usecases/get-categories.usecase";
import { DeleteTasksUseCase } from "../../domain/usecases/delete-task.usecase";
import { UpdateMultipleTaskUseCase } from "../../domain/usecases/update-multiple-tasks.usecase";

import { Task } from "../../domain/models/task.model";
import { Category } from "src/app/features/categories/domain/models/category.model";

@Injectable({
    providedIn: "root"
})
export class TaskFacadeService {
    tasks = signal<Task[]>([]);
    categories = signal<Category[]>([]);

    constructor(
        private createTaskUseCase: CreateTaskUseCase,
        private getAllTasksUseCase: GetTasksUseCase,
        private getAllCategoriesUseCase: GetCategoriesUseCase,
        private deleteTaskUseCase: DeleteTasksUseCase,
        private updateTaskUseCase: UpdateTaskUseCase,
        private updateMultipleTaskUseCase: UpdateMultipleTaskUseCase
    ) {}

    async loadAll() {
        const [tasks, categories] = await Promise.all([
            this.getAllTasksUseCase.execute(),
            this.getAllCategoriesUseCase.execute()
        ]);

        this.tasks.set(tasks);
        this.categories.set(categories);
    }

    async create(data: Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">) {
        const newTask = await this.createTaskUseCase.execute(data);
        this.tasks.update((t) => [newTask, ...t]);
        return newTask;
    }

    async update(task: Task) {
        await this.updateTaskUseCase.execute(task);
        this.tasks.update((list) => list.map((t) => (t.id === task.id ? task : t)));
    }

    async remove(taskId: string) {
        await this.deleteTaskUseCase.execute(taskId);
        this.tasks.update((list) => list.filter((t) => t.id !== taskId));
    }

    async toggleCompleted(task: Task) {
        const previous = this.tasks();
        
        try {
            await this.update(task);
        } catch (error) {
            this.tasks.set(previous);
            throw error;
        }
    }

    async reorder(reorderedList: Task[]) {
        const previous = this.tasks();
        this.tasks.update((list) => list.map((t) => reorderedList.find((r) => r.id === t.id) ?? t));

        try {
            await this.updateMultipleTaskUseCase.execute(reorderedList);
        } catch (error) {
            this.tasks.set(previous);
            throw error;
        }
    }

    categoryName(categoryId: string): string {
        return this.categories().find((c) => c.id === categoryId)?.name ?? "Desconocida";
    }
}
