import { Injectable } from "@angular/core";
import { TaskStorageRepository } from "../../data/repositories/task-storage.repository";
import { Task } from "../models/task.model";

@Injectable({
    providedIn: "root"
})
export class CreateTaskUseCase {
    constructor(private taskRepository: TaskStorageRepository) {}

    async execute(
        taskData: Omit<Task, "id" | "completed" | "createdAt" | "updatedAt">
    ): Promise<Task> {
        const existingTasks = await this.taskRepository.getAllTasks();

        const minOrder =
            existingTasks.length > 0 ? Math.min(...existingTasks.map((t) => t.order || 0)) : 0;
        const newOrder = existingTasks.length > 0 ? minOrder - 1 : 0;

        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            completed: false,
            order: newOrder
        };

        await this.taskRepository.createTask(newTask);
        return newTask;
    }
}
