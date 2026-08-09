import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
    IonButton,
    IonInput,
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
import { Category } from "../../../domain/models/category.model";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "app-category-upsert-form",
    templateUrl: "./category-upsert-form.component.html",
    styleUrls: ["./category-upsert-form.component.scss"],
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
        IonButton
    ]
})
export class CategoryUpsertFormComponent implements OnInit {
    @Input() categoryToEdit?: Category;
    @Output() confirmDeleteCategory?: () => void;

    categoryForm!: FormGroup;
    isEditing = false;

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        this.isEditing = !!this.categoryToEdit;

        this.categoryForm = this.fb.group({
            name: [this.categoryToEdit?.name || "", [Validators.required]]
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    onSubmit() {
        if (this.categoryForm.valid) {
            const resultData = this.isEditing
                ? { ...this.categoryToEdit, ...this.categoryForm.value }
                : this.categoryForm.value;

            this.modalCtrl.dismiss(resultData, "confirm");
        } else {
            this.categoryForm.markAllAsTouched();
        }
    }

    onDeleteClicked() {
        if (this.confirmDeleteCategory) {
            this.confirmDeleteCategory();
        }
    }
}
