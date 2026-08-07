import { Injectable } from "@angular/core";
import { TaskStorageRepository } from "../../data/repositories/task-storage.repository";
import { Task } from "../models/task.model";

@Injectable({
    providedIn: "root"
})
export class UpdateTaskUseCase {
    constructor(private taskRepository: TaskStorageRepository) {}

    async execute(taskData: Task): Promise<Task> {
        const taskToUpdate: Task = {
            ...taskData,
            updatedAt: new Date()
        };

        await this.taskRepository.updateTask(taskToUpdate.id, taskToUpdate);
        return taskToUpdate;
    }
}
