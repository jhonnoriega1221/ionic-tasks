import { Component, OnInit, ViewChild } from "@angular/core";
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonCheckbox,
    IonModal
} from "@ionic/angular/standalone";
import { CdkVirtualScrollViewport, ScrollingModule } from "@angular/cdk/scrolling";
import { TodoCreationFormComponent } from "../../components/todo-creation-form/todo-creation-form.component";
import { CreateTaskUseCase } from "../../../domain/usecases/create-task.usecase";
import { Task } from "../../../domain/models/task.model";
import { GetTasksUseCase } from "../../../domain/usecases/get-tasks.usecase";
import { DeleteTasksUseCase } from "../../../domain/usecases/delete-task.usecase";

@Component({
    selector: "app-todos",
    templateUrl: "./todos.page.html",
    styleUrls: ["./todos.page.scss"],
    standalone: true,
    imports: [
        IonModal,
        ScrollingModule,
        IonItemSliding,
        IonItemOptions,
        IonItemOption,
        IonLabel,
        IonItem,
        IonList,
        IonIcon,
        IonFabButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonFab,
        IonCheckbox,
        TodoCreationFormComponent
    ]
})
export class TodosPage implements OnInit {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    presentingElement!: HTMLElement | null;

    tasks: Task[] = [];

    constructor(
        private createTaskUseCase: CreateTaskUseCase,
        private getAllTasksUseCase: GetTasksUseCase,
        private deleteTaskUseCase: DeleteTasksUseCase
    ) {}

    async ngOnInit() {
        this.presentingElement = document.querySelector(".page-content");
        await this.loadTasks();
    }

    private async loadTasks() {
        try {
            this.tasks = await this.getAllTasksUseCase.execute();
        } catch (error) {
            console.error("Error al cargar las tareas: ", error);
        }
    }

    async onDeleteTask(taskId: string) {
        try {
            await this.deleteTaskUseCase.execute(taskId);
            this.tasks = this.tasks.filter((t) => t.id !== taskId);
        } catch (error) {
            console.error("Error al eliminar tarea: ", error);
        }
    }

    ionViewDidEnter() {
        if (this.viewport) {
            this.viewport.checkViewportSize();
        }
    }

    async onModalDismiss(event: any) {
        const { role, data } = event.detail;

        if (role === "confirm" && data) {
            try {
                const newTask = await this.createTaskUseCase.execute({
                    name: data.name,
                    description: data.description,
                    categoryId: data.categoryId
                });

                this.tasks = [...this.tasks, newTask];

                setTimeout(() => this.viewport?.checkViewportSize(), 50);
            } catch (error) {
                console.error("Error al intentar agregar tarea: ", error);
            }
        }
    }
}
