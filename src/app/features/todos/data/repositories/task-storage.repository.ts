import { StorageService } from "src/app/core/storage.service";
import { TaskRepository } from "./task.repository";
import { Injectable } from "@angular/core";
import { Task } from "../../domain/models/task.model";

@Injectable({
    providedIn: "root"
})
export class TaskStorageRepository implements TaskRepository {
    private readonly STORE_NAME = "todos";

    constructor(private storage: StorageService) {}

    async createTask(task: Task): Promise<void> {
        await this.storage.set(this.STORE_NAME, task.id, task);
    }

    async getAllTasks(): Promise<Task[]> {
        const todos: Task[] = [];
        await this.storage.forEach(this.STORE_NAME, (value: Task) => {
            todos.push(value);
        });

        return todos.sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    async updateMultipleTasks(tasks: Task[]): Promise<void> {
        await this.storage.setMultiple(this.STORE_NAME, tasks);
    }

    async getTaskById(id: string): Promise<Task | null> {
        return await this.storage.get<Task>(this.STORE_NAME, id);
    }

    async updateTask(id: string, task: Task): Promise<void> {
        await this.storage.set(this.STORE_NAME, id, task);
    }

    async deleteTask(id: string): Promise<void> {
        await this.storage.remove(this.STORE_NAME, id);
    }
}
