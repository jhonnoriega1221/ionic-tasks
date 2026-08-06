import { Component, OnInit } from "@angular/core";
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
    IonCheckbox
} from "@ionic/angular/standalone";
import { ScrollingModule } from "@angular/cdk/scrolling";

@Component({
    selector: "app-todos",
    templateUrl: "./todos.page.html",
    styleUrls: ["./todos.page.scss"],
    standalone: true,
    imports: [
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
        IonCheckbox
    ]
})
export class TodosPage implements OnInit {
    tasks = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Tarea ${i + 1}`,
        completed: false
    }));
    constructor() {}

    ngOnInit() {}
}
