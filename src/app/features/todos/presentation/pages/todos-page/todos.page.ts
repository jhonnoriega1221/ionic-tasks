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

    tasks = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Tarea ${i + 1}`,
        completed: false
    }));
    constructor() {}

    ngOnInit() {
        this.presentingElement = document.querySelector(".page-content");
    }

    ionViewDidEnter() {
        if (this.viewport) {
            this.viewport.checkViewportSize();
        }
    }
}
