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

@Component({
    selector: "app-todos",
    templateUrl: "./todos.page.html",
    styleUrls: ["./todos.page.scss"],
    standalone: true,
    imports: [
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
    constructor() {}

    ngOnInit() {}
}
