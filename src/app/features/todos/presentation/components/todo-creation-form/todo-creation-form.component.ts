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

@Component({
    selector: "app-todo-creation-form",
    templateUrl: "./todo-creation-form.component.html",
    styleUrls: ["./todo-creation-form.component.scss"],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonButtons,
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
        IonSelectOption,
        IonFooter
    ]
})
export class TodoCreationFormComponent implements OnInit {
    @Input() taskToEdit?: Task;
    @Output() confirmDeleteTask?: () => void;

    todoForm!: FormGroup;
    isEditing = false;

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        this.isEditing = !!this.taskToEdit;

        this.todoForm = this.fb.group({
            name: [this.taskToEdit?.name || "", [Validators.required]],
            description: [this.taskToEdit?.description || "", [Validators.required]],
            categoryId: [this.taskToEdit?.categoryId || ""]
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    onSubmit() {
        if (this.todoForm.valid) {
            const resultData = this.isEditing
                ? { ...this.taskToEdit, ...this.todoForm.value }
                : this.todoForm.value;

            this.modalCtrl.dismiss(resultData, "confirm");
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
