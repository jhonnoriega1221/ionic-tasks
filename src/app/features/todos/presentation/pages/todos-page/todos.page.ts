import { Component, computed, OnInit, signal, ViewChild } from "@angular/core";
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
    AlertController,
    ModalController,
    ItemReorderEventDetail,
    IonButtons,
    IonButton,
    IonPopover
} from "@ionic/angular/standalone";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { TodoCreationFormComponent } from "../../components/todo-creation-form/todo-creation-form.component";
import { Task } from "../../../domain/models/task.model";
import { DataStateComponent } from "src/app/shared/components/data-state/data-state.component";
import { CategoryFilterPopoverComponent } from "../../components/category-filter-popover/category-filter-popover.component";
import { FirebaseRemoteConfigService } from "src/app/core/firebase-remote-config.service";
import { TasksListComponent } from "../../components/tasks-list/tasks-list.component";
import { TaskFacadeService } from "../../facades/task-facade.service";
import { Category } from "src/app/features/categories/domain/models/category.model";
@Component({
    selector: "app-todos",
    templateUrl: "./todos.page.html",
    styleUrls: ["./todos.page.scss"],
    standalone: true,
    imports: [
        IonPopover,
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
        TasksListComponent,
        CategoryFilterPopoverComponent
    ]
})
export class TodosPage implements OnInit {
    @ViewChild(TasksListComponent) taskList?: TasksListComponent;

    tasks = this.taskFacadeService.tasks;
    categories = this.taskFacadeService.categories;
    categoryFilterSelected = signal<Category | undefined>(undefined);
    filteredTasks = computed(() => {
        const id = this.categoryFilterSelected()?.id!;
        return id ? this.tasks().filter((t) => t.categoryId === id) : this.tasks();
    });
    showFilterButton: boolean = false;

    constructor(
        private remoteConfigService: FirebaseRemoteConfigService,
        private alertController: AlertController,
        private modalController: ModalController,
        private taskFacadeService: TaskFacadeService
    ) {}

    async ngOnInit() {
        this.showFilterButton =
            await this.remoteConfigService.isFeatureEnabled("enable_task_filter");
    }

    async ionViewWillEnter() {
        await this.taskFacadeService.loadAll();
    }

    ionViewDidEnter() {
        this.taskList?.checkViewportSize();
    }

    // Aplica el filtro
    applyFilter(categorySelectedId?: string) {
        if (categorySelectedId === undefined) return;

        const categoryInfo =
            categorySelectedId === ""
                ? undefined
                : this.categories().find((c) => c.id === categorySelectedId);
        this.categoryFilterSelected.set(categoryInfo);
        setTimeout(() => this.taskList?.checkViewportSize(), 50);
    }

    // Al cambiar tarea de posición
    async onReorder(event: CustomEvent<ItemReorderEventDetail>) {
        const reordered = event.detail.complete(this.tasks()) as Task[];

        const withNewOrder = reordered.map((task, index) => ({
            ...task,
            order: index
        }));

        try {
            await this.taskFacadeService.reorder(withNewOrder);
        } catch (error) {
            console.error("Error persistiendo el reordenamiento:", error);
            // Toast
        }
    }

    // Al marcar tarea como completada
    async onToggleComplete(task: Task, isCompleted: boolean) {
        if (task.completed === isCompleted) return;

        const updatedTask = { ...task, completed: isCompleted };

        try {
            await this.taskFacadeService.update(updatedTask);
        } catch (error) {
            console.error("Error al actualizar el estado de la tarea:", error);
            // toast
        }
    }

    // Mostrar confirmación de eliminación
    async confirmDeleteTask(taskId: string, modal?: HTMLIonModalElement) {
        const alert = await this.alertController.create({
            header: "Confirmar eliminación",
            message: "¿Estás seguro de que deseas eliminar esta tarea?",
            buttons: [
                {
                    text: "Cancelar"
                },
                {
                    text: "Eliminar",
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

    // Al eliminar tarea
    async onDeleteTask(taskId: string) {
        try {
            await this.taskFacadeService.remove(taskId);
            //toast
        } catch (error) {
            console.error("Error al eliminar tarea: ", error);
            //toast
        }
    }

    // Mostrar modal que contiene al form de creación / edición de tarea
    async openModal(taskToEdit?: Task) {
        const modal = this.modalController.create({
            component: TodoCreationFormComponent,
            breakpoints: [0, 0.85],
            initialBreakpoint: 0.85,
            componentProps: {
                taskToEdit: taskToEdit,
                confirmDeleteTask: async () => {
                    // Acción que se realiza al eliminar tarea
                    if (taskToEdit?.id) {
                        this.confirmDeleteTask(taskToEdit.id, await modal);
                    }
                }
            }
        });
        (await modal).present();

        // Acción que se realiza al hacer submit del formulario
        const { data, role } = await (await modal).onDidDismiss();
        if (role === "confirm" && data) {
            if (!!taskToEdit) {
                //Si se está editando tarea
                await this.taskFacadeService.update(data);
            } else {
                //Si se está creando tarea
                await this.taskFacadeService.create(data);
            }
            //Toast
            setTimeout(() => this.taskList?.checkViewportSize(), 50);
        }
    }
}
