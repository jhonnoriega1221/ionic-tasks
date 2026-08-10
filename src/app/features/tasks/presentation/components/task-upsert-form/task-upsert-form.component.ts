import { Component, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    IonButton,
    IonSelect,
    IonInput,
    IonTextarea,
    IonSelectOption,
    IonIcon,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    ModalController,
    IonText
} from "@ionic/angular/standalone";
import { Task } from "../../../domain/models/task.model";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CategoryUpsertFormComponent } from "src/app/features/categories/presentation/components/category-upsert-form/category-upsert-form.component";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";
import { ToastService } from "src/app/shared/services/toast.service";

@Component({
    selector: "app-task-upsert-form",
    templateUrl: "./task-upsert-form.component.html",
    styleUrls: ["./task-upsert-form.component.scss"],
    imports: [
        IonText,
        CommonModule,
        ReactiveFormsModule,
        IonTitle,
        IonToolbar,
        IonHeader,
        IonContent,
        IonGrid,
        IonRow,
        IonCol,
        IonIcon,
        IonInput,
        IonTextarea,
        IonButton,
        IonSelect,
        IonSelectOption
    ]
})
export class TaskUpsertFormComponent implements OnInit {
    @Input() taskToEdit?: Task;
    @Output() confirmDeleteTask?: () => void;

    taskForm!: FormGroup;
    isEditing = false;

    categories = this.categoriesFacade.categories;

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private categoriesFacade: CategoryFacadeService,
        private toastService: ToastService
    ) {}

    async ngOnInit() {
        this.isEditing = !!this.taskToEdit;

        this.taskForm = this.fb.group({
            name: [this.taskToEdit?.name || "", [Validators.required]],
            description: [this.taskToEdit?.description || ""],
            categoryId: [this.taskToEdit?.categoryId || ""]
        });

        await this.categoriesFacade.loadAll();
    }

    async openCategoryModal() {
        const modal = await this.modalController.create({
            component: CategoryUpsertFormComponent,
            breakpoints: [0, 0.5],
            initialBreakpoint: 0.5,
            componentProps: {}
        });

        await modal.present();

        const { data, role } = await modal.onDidDismiss();

        if (role === "confirm" && data) {
            const newCategory = await this.categoriesFacade.create(data);
            this.taskForm.patchValue({
                categoryId: newCategory.id
            });
            this.toastService.showToast("Categoría creada exitosamente");
        }
    }

    onSubmit() {
        if (this.taskForm.valid) {
            const resultData = this.isEditing
                ? { ...this.taskToEdit, ...this.taskForm.value }
                : this.taskForm.value;

            this.modalController.dismiss(resultData, "confirm");
        } else {
            this.taskForm.markAllAsTouched();
        }
    }

    onDeleteClicked() {
        if (this.confirmDeleteTask) {
            this.confirmDeleteTask();
        }
    }
}
