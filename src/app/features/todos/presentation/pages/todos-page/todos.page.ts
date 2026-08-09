import { Component, OnInit, ViewChild } from "@angular/core";
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonItem,
    IonLabel,
    ToastController,
    AlertController,
    ModalController,
    ItemReorderEventDetail,
    IonButtons,
    IonButton,
    PopoverController
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
import { Category } from "src/app/features/categories/domain/models/category.model";
import { GetCategoriesUseCase } from "src/app/features/categories/domain/usecases/get-categories.usecase";
import { CategoryFilterPopoverComponent } from "../../components/category-filter-popover/category-filter-popover.component";
import { FirebaseRemoteConfigService } from "src/app/core/firebase-remote-config.service";
import { TasksListComponent } from "../../components/tasks-list/tasks-list.component";
@Component({
    selector: "app-todos",
    templateUrl: "./todos.page.html",
    styleUrls: ["./todos.page.scss"],
    standalone: true,
    imports: [
        IonButton,
        IonButtons,
        ScrollingModule,
        IonLabel,
        IonItem,
        IonIcon,
        IonFabButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonFab,
        DataStateComponent,
        TasksListComponent
    ]
})
export class TodosPage implements OnInit {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    @ViewChild(TasksListComponent) taskList?: TasksListComponent;

    tasks: Task[] = [];
    filteredTasks: Task[] = [];
    selectedCategoryId: string | null = null;
    categories: Category[] = [];
    showFilterButton: boolean = false;

    constructor(
        private remoteConfigService: FirebaseRemoteConfigService,
        private toastController: ToastController,
        private alertController: AlertController,
        private modalController: ModalController,
        private popoverController: PopoverController,
        private createTaskUseCase: CreateTaskUseCase,
        private getAllTasksUseCase: GetTasksUseCase,
        private getAllCategoriesUseCase: GetCategoriesUseCase,
        private deleteTaskUseCase: DeleteTasksUseCase,
        private updateTaskUseCase: UpdateTaskUseCase,
        private updateMultipleTaskUseCase: UpdateMultipleTaskUseCase
    ) {}

    async ngOnInit() {
        this.showFilterButton =
            await this.remoteConfigService.isFeatureEnabled("enable_task_filter");
    }

    async ionViewWillEnter() {
        await this.loadCategories();
        await this.loadTasks();
    }

    ionViewDidEnter() {
        this.taskList?.checkViewportSize();
    }

    getCategoryName(categoryId: string): string {
        const category = this.categories.find((c) => c.id === categoryId);
        return category ? category.name : "Desconocida";
    }

    private async loadTasks() {
        try {
            this.tasks = await this.getAllTasksUseCase.execute();
            this.filteredTasks = this.tasks;
        } catch (error) {
            console.error("Error al cargar las tareas: ", error);
        }
    }

    private async loadCategories() {
        try {
            this.categories = await this.getAllCategoriesUseCase.execute();
        } catch (error) {
            console.error("Error al cargar las categorías: ", error);
        }
    }

    async presentCategoryFilter(event: Event) {
        const popover = await this.popoverController.create({
            component: CategoryFilterPopoverComponent,
            event: event,
            componentProps: {
                categories: this.categories,
                selectedCategoryId: this.selectedCategoryId
            }
        });

        await popover.present();

        const { data } = await popover.onDidDismiss();

        if (data !== undefined) {
            this.applyFilter(data);
        }
    }

    applyFilter(filterSelected: string) {
        this.selectedCategoryId = filterSelected;
        
        if (!filterSelected) {
            this.loadTasks();
        } else {
            this.filteredTasks = this.tasks.filter(
                (task) => task.categoryId === filterSelected
            );
        }

        setTimeout(() => this.taskList?.checkViewportSize(), 50);
    }

    clearFilter() {
        this.applyFilter("");
    }

    async onReorder(event: CustomEvent<ItemReorderEventDetail>) {
        this.filteredTasks = event.detail.complete(this.filteredTasks);

        this.filteredTasks = this.filteredTasks.map((task, index) => ({
            ...task,
            order: index
        }));

        this.filteredTasks.forEach((filteredTask) => {
            const index = this.tasks.findIndex((t) => t.id === filteredTask.id);
            if (index !== -1) {
                this.tasks[index] = filteredTask;
            }
        });

        event.detail.complete();

        try {
            await this.updateMultipleTaskUseCase.execute(this.filteredTasks);
        } catch (error) {
            console.error("Error persistiendo el reordenamiento:", error);
        }
    }

    async onToggleComplete(task: Task, isCompleted: boolean) {
        if (task.completed === isCompleted) return;

        const updatedTask = { ...task, completed: isCompleted };

        this.tasks = this.tasks.map((t) => (t.id === task.id ? updatedTask : t));
        this.filteredTasks = this.filteredTasks.map((t) => (t.id === task.id ? updatedTask : t));

        try {
            await this.updateTaskUseCase.execute(updatedTask);
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);
            this.tasks = this.tasks.map((t) => (t.id === task.id ? task : t));
            this.filteredTasks = this.filteredTasks.map((t) => (t.id === task.id ? task : t));

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
            this.filteredTasks = this.filteredTasks.filter((t) => t.id !== taskId);
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
            breakpoints: [0, 0.85],
            initialBreakpoint: 0.85,
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

        if (role === "confirm" && data) {
            if (taskToEdit) {
                await this.updateTaskUseCase.execute(data);
                this.tasks = this.tasks.map((t) => (t.id === data.id ? data : t));
                this.filteredTasks = this.filteredTasks.map((t) => (t.id === data.id ? data : t));

                const toast = await this.toastController.create({
                    message: "Tarea actualizada exitosamente",
                    positionAnchor: "task-fab",
                    duration: 2000
                });

                await toast.present();
            } else {
                const newTask = await this.createTaskUseCase.execute(data);
                this.tasks = [newTask, ...this.tasks];

                if (!this.selectedCategoryId || newTask.categoryId === this.selectedCategoryId) {
                    this.filteredTasks = [newTask, ...this.filteredTasks];
                }

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

    private async handleTaskSaved(data: Task, isEdit: boolean) {
        
    }
}
