import { Injectable } from "@angular/core";
import { TaskStorageRepository } from "../../data/repositories/task-storage.repository";
import { TaskRepository } from "../../data/repositories/task.repository";
import { Task } from "../models/task.model";

@Injectable({
    providedIn: "root"
})
export class UpdateMultipleTaskUseCase {
    constructor(private taskRepository: TaskStorageRepository) {}

    execute(tasks: Task[]): Promise<void> {
        const reorderedTasks = tasks.map((task, index) => ({
            ...task,
            order: index
        }));
        return this.taskRepository.updateMultipleTasks(reorderedTasks);
    }
}
