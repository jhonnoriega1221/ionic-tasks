import { Task } from "../../domain/models/task.model";

export abstract class TaskRepository {
    abstract createTask(task: Task): Promise<void>;
    abstract getAllTasks(): Promise<Task[]>;
    abstract getTaskById(id: string): Promise<Task | null>;
    abstract updateTask(id:string, task: Task): Promise<void>;
    abstract deleteTask(id: string): Promise<void>;
}
