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
    ToastController,
    AlertController,
    ModalController,
    IonReorderGroup,
    IonReorder,
    ItemReorderEventDetail
} from "@ionic/angular/standalone";
import { CdkVirtualScrollViewport, ScrollingModule } from "@angular/cdk/scrolling";
import { TodoCreationFormComponent } from "../../components/todo-creation-form/todo-creation-form.component";
import { CreateTaskUseCase } from "../../../domain/usecases/create-task.usecase";
import { Task } from "../../../domain/models/task.model";
import { GetTasksUseCase } from "../../../domain/usecases/get-tasks.usecase";
import { DeleteTasksUseCase } from "../../../domain/usecases/delete-task.usecase";
import { DataStateComponent } from "src/app/shared/components/data-state/data-state.component";
import { UpdateTaskUseCase } from "../../../domain/usecases/update-task.usecase";
import { UpdateMultipleTaskUseCase } from "../../../domain/usecases/update-multiple-tasks.usecase";
@Component({
    selector: "app-todos",
    templateUrl: "./todos.page.html",
    styleUrls: ["./todos.page.scss"],
    standalone: true,
    imports: [
        IonReorder,
        IonReorderGroup,
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
        DataStateComponent
    ]
})
export class TodosPage implements OnInit {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    presentingElement!: HTMLElement | null;

    tasks: Task[] = [];

    constructor(
        private toastController: ToastController,
        private alertController: AlertController,
        private modalController: ModalController,
        private createTaskUseCase: CreateTaskUseCase,
        private getAllTasksUseCase: GetTasksUseCase,
        private deleteTaskUseCase: DeleteTasksUseCase,
        private updateTaskUseCase: UpdateTaskUseCase,
        private updateMultipleTaskUseCase: UpdateMultipleTaskUseCase
    ) {}

    async ngOnInit() {
        this.presentingElement = document.querySelector(".page-content");
    }

    async ionViewWillEnter() {
        await this.loadTasks();
    }

    ionViewDidEnter() {
        if (this.viewport) {
            this.viewport.checkViewportSize();
        }
    }

    private async loadTasks() {
        try {
            this.tasks = await this.getAllTasksUseCase.execute();
        } catch (error) {
            console.error("Error al cargar las tareas: ", error);
        }
    }

    async onReorder(event: CustomEvent<ItemReorderEventDetail>) {
        const itemToMove = this.tasks.splice(event.detail.from, 1)[0];

        this.tasks.splice(event.detail.to, 0, itemToMove);

        event.detail.complete();

        try {
            await this.updateMultipleTaskUseCase.execute(this.tasks);
        } catch (error) {
            console.error("Error persistiendo el reordenamiento:", error);
        }
    }

    async onToggleComplete(task: Task, event: any) {
        const isCompleted = event.detail.checked;

        if (task.completed === isCompleted) return;

        const updatedTask = { ...task, completed: isCompleted };

        this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));

        try {
            await this.updateTaskUseCase.execute(updatedTask);
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);
            this.tasks = this.tasks.map((t) => (t.id === task.id ? task : t));

            const toast = await this.toastController.create({
                message: "Error al guardar los cambios",
                duration: 2000,
                color: "danger"
            });
            await toast.present();
        }
    }

    async confirmDeleteTask(taskId: string, modal?: HTMLIonModalElement) {
        const alert = await this.alertController.create({
            header: "Confirmar eliminación",
            message: "¿Estás seguro de que deseas eliminar esta tarea?",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel",
                    cssClass: "secondary"
                },
                {
                    text: "Eliminar",
                    role: "confirm",
                    handler: async () => {
                        if (modal) {
                            await modal.dismiss();
                        }
                        this.onDeleteTask(taskId);
                    }
                }
            ]
        });

        await alert.present();
    }

    async onDeleteTask(taskId: string) {
        try {
            await this.deleteTaskUseCase.execute(taskId);

            this.tasks = this.tasks.filter((t) => t.id !== taskId);
            const toast = await this.toastController.create({
                message: "Tarea eliminada exitosamente",
                positionAnchor: "task-fab",
                duration: 2000
            });

            await toast.present();
        } catch (error) {
            console.error("Error al eliminar tarea: ", error);
        }
    }

    async openModal(taskToEdit?: Task) {
        const modal = this.modalController.create({
            component: TodoCreationFormComponent,
            componentProps: {
                taskToEdit: taskToEdit,
                confirmDeleteTask: async () => {
                    if (taskToEdit?.id) {
                        this.confirmDeleteTask(taskToEdit.id, await modal);
                    }
                }
            }
        });

        (await modal).present();

        const { data, role } = await (await modal).onDidDismiss();

        if (role === "delete" && data?.id) {
            this.confirmDeleteTask(data.id);
            return;
        }

        if (role === "confirm" && data) {
            if (taskToEdit) {
                await this.updateTaskUseCase.execute(data);
                this.tasks = this.tasks.map((t) => (t.id === data.id ? data : t));

                const toast = await this.toastController.create({
                    message: "Tarea actualizada exitosamente",
                    positionAnchor: "task-fab",
                    duration: 2000
                });

                await toast.present();
            } else {
                const newTask = await this.createTaskUseCase.execute(data);
                this.tasks = [newTask, ...this.tasks];

                const toast = await this.toastController.create({
                    message: "Tarea creada exitosamente",
                    positionAnchor: "task-fab",
                    duration: 2000
                });

                await toast.present();
            }
            setTimeout(() => this.viewport?.checkViewportSize(), 50);
        }
    }
}
