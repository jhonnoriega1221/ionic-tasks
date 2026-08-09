import { Injectable } from "@angular/core";
import { TaskStorageRepository } from "../../data/repositories/task-storage.repository";
import { Task } from "../models/task.model";

@Injectable({
    providedIn: "root"
})
export class GetTasksUseCase {
    constructor(private taskRepository: TaskStorageRepository) {}

    async execute(): Promise<Task[]> {
        return await this.taskRepository.getAllTasks();
    }
}
