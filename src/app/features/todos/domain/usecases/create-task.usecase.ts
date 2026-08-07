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
        const newTask: Task = {
            ...taskData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            completed: false
        };

        await this.taskRepository.createTask(newTask);
        return newTask;
    }
}
