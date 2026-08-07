import { Component, OnInit } from "@angular/core";
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
    todoForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private modalCtrl: ModalController
    ) {}

    ngOnInit() {
        this.todoForm = this.fb.group({
            name: ["", [Validators.required]],
            description: ["", [Validators.required]],
            categoryId: [""]
        });
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    onSubmit() {
        if (this.todoForm.valid) {
            this.modalCtrl.dismiss(this.todoForm.value, "confirm");
        } else {
            this.todoForm.markAllAsTouched();
        }
    }
}
