import { Injectable } from "@angular/core";
import { TaskStorageRepository } from "../../data/repositories/task-storage.repository";
import { Task } from "../models/task.model";

@Injectable({
    providedIn: "root"
})
export class DeleteTasksUseCase {
    constructor(private taskRepository: TaskStorageRepository) {}

    async execute(taskId: string): Promise<void> {
        await this.taskRepository.deleteTask(taskId);
    }
}
