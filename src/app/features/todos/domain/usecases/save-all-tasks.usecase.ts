import { Injectable } from "@angular/core";
import { Task } from "../models/task.model";
import { TaskRepository } from "../../data/repositories/task.repository";
import { TaskStorageRepository } from "../../data/repositories/task-storage.repository";

@Injectable({
    providedIn: "root"
})
export class SaveAllTasksUseCase {
    constructor(private taskRepository: TaskStorageRepository) {}

    async execute(tasks: Task[]): Promise<void> {
        //return this.taskRepository.saveAll(tasks);
    }
}
