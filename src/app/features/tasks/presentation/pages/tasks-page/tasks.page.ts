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
import { TaskUpsertFormComponent } from "../../components/task-upsert-form/task-upsert-form.component";
import { Task } from "../../../domain/models/task.model";
import { DataStateComponent } from "src/app/shared/components/data-state/data-state.component";
import { CategoryFilterPopoverComponent } from "../../components/category-filter-popover/category-filter-popover.component";
import { FirebaseRemoteConfigService } from "src/app/core/firebase-remote-config.service";
import { TasksListComponent } from "../../components/tasks-list/tasks-list.component";
import { TaskFacadeService } from "../../facades/task-facade.service";
import { Category } from "src/app/features/categories/domain/models/category.model";
import { ToastService } from "src/app/shared/services/toast.service";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";
import { ListOptionsPopoverComponent } from "../../components/list-options-popover/list-options-popover.component";
import { DEFAULT_ORDER_VIEW, ORDER_VIEW, OrderViewId } from "../../constants/list-types";
import { DateTasksListComponent } from "../../components/date-tasks-list/date-tasks-list.component";
@Component({
    selector: "app-tasks",
    templateUrl: "./tasks.page.html",
    styleUrls: ["./tasks.page.scss"],
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
        CategoryFilterPopoverComponent,
        ListOptionsPopoverComponent,
        DateTasksListComponent
    ]
})
export class TasksPage implements OnInit {
    @ViewChild(TasksListComponent) taskList?: TasksListComponent;

    tasks = this.taskFacadeService.tasks;
    categoryFilterSelected = signal<Category | undefined>(undefined);
    orderSelected = signal<OrderViewId>(DEFAULT_ORDER_VIEW.id);
    filteredTasks = computed(() => {
        const id = this.categoryFilterSelected()?.id!;
        return id ? this.tasks().filter((t) => t.categoryId === id) : this.tasks();
    });
    showFilterButton: boolean = false;

    constructor(
        private remoteConfigService: FirebaseRemoteConfigService,
        private toastService: ToastService,
        private alertController: AlertController,
        private modalController: ModalController,
        private taskFacadeService: TaskFacadeService,
        private categoryFacadeService: CategoryFacadeService
    ) {}

    async ngOnInit() {
        this.showFilterButton =
            await this.remoteConfigService.isFeatureEnabled("enable_task_filter");
    }

    async ionViewWillEnter() {
        try {
            await Promise.all([
                this.taskFacadeService.loadAll(),
                this.categoryFacadeService.loadAll()
            ]);
        } catch (error) {
            this.showToast("Error al cargar los datos");
        }
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
                : this.categoryFacadeService.categories().find((c) => c.id === categorySelectedId);
        this.categoryFilterSelected.set(categoryInfo);
        setTimeout(() => this.taskList?.checkViewportSize(), 50);
    }

    // Selecciona el tipo de vista del orden de las tareas (mi orden, por fecha)
    onOrderViewChange(orderId: OrderViewId | undefined) {
        if (orderId) this.orderSelected.set(orderId);
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
            this.showToast("Error al reordenar la tarea");
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
            this.showToast("Error al actualizar la tarea");
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
            this.showToast("Tarea eliminada");
        } catch (error) {
            console.error("Error al eliminar tarea: ", error);
            this.showToast("Hubo un error al eliminar la tarea");
        }
    }

    // Mostrar modal que contiene al form de creación / edición de tarea
    async openModal(taskToEdit?: Task) {
        const modal = this.modalController.create({
            component: TaskUpsertFormComponent,
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
            try {
                if (!!taskToEdit) {
                    //Si se está editando tarea
                    await this.taskFacadeService.update(data);
                    this.showToast("Tarea actualizada exitosamente");
                } else {
                    //Si se está creando tarea
                    await this.taskFacadeService.create(data);
                    this.showToast("Tarea creada exitosamente");
                }
            } catch (error) {
                console.error("Error al guardar tarea:", error);
                this.showToast("Hubo un error al guardar la tarea");
            }
            setTimeout(() => this.taskList?.checkViewportSize(), 50);
        }
    }

    private showToast(message: string) {
        this.toastService.showToast(message, { positionAnchor: "task-fab" });
    }
}
