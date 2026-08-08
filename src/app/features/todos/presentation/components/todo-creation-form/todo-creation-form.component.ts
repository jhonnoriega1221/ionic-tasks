import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
    IonButtons,
    ModalController,
    IonFooter
} from "@ionic/angular/standalone";
import { Task } from "../../../domain/models/task.model";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Category } from "src/app/features/categories/domain/models/category.model";
import { GetCategoriesUseCase } from "src/app/features/categories/domain/usecases/get-categories.usecase";
import { CategoryCreationFormComponent } from "src/app/features/categories/presentation/components/category-creation-form/category-creation-form.component";
import { CreateCategoryUseCase } from "src/app/features/categories/domain/usecases/create-category.usecase";

@Component({
    selector: "app-todo-creation-form",
    templateUrl: "./todo-creation-form.component.html",
    styleUrls: ["./todo-creation-form.component.scss"],
    imports: [
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
export class TodoCreationFormComponent implements OnInit {
    @Input() taskToEdit?: Task;
    @Output() confirmDeleteTask?: () => void;

    todoForm!: FormGroup;
    isEditing = false;

    categories: Category[] = [];

    constructor(
        private fb: FormBuilder,
        private modalController: ModalController,
        private getCategoriesUseCase: GetCategoriesUseCase,
        private createCategoryUseCase: CreateCategoryUseCase
    ) {}

    async ngOnInit() {
        this.isEditing = !!this.taskToEdit;

        this.todoForm = this.fb.group({
            name: [this.taskToEdit?.name || "", [Validators.required]],
            description: [this.taskToEdit?.description || "", [Validators.required]],
            categoryId: [this.taskToEdit?.categoryId || ""]
        });

        await this.loadCategories();
    }

    async loadCategories() {
        try {
            this.categories = await this.getCategoriesUseCase.execute();
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    }

    dismiss() {
        this.modalController.dismiss();
    }

    async openCategoryModal() {
        const modal = await this.modalController.create({
            component: CategoryCreationFormComponent,
            breakpoints: [0, 0.5],
            initialBreakpoint: 0.5
        });

        await modal.present();

        const { data, role } = await modal.onDidDismiss();

        if (role === "confirm" && data) {
            try {
                const newCategory = await this.createCategoryUseCase.execute(data);
                this.categories = [...this.categories, newCategory];
                this.todoForm.patchValue({
                    categoryId: newCategory.id
                });
            } catch (error) {
                console.error("Hubo error al crear categoría: ", error);
            }
        }
    }

    onSubmit() {
        if (this.todoForm.valid) {
            const resultData = this.isEditing
                ? { ...this.taskToEdit, ...this.todoForm.value }
                : this.todoForm.value;

            this.modalController.dismiss(resultData, "confirm");
        } else {
            this.todoForm.markAllAsTouched();
        }
    }

    onDeleteClicked() {
        if (this.confirmDeleteTask) {
            this.confirmDeleteTask();
        }
    }
}
