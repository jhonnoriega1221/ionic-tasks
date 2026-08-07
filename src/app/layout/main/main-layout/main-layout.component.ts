import { Component, OnInit } from "@angular/core";
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";

import { addIcons } from "ionicons";
import { list, copy, settings, add, trash, alertCircleOutline, warningOutline } from "ionicons/icons";

@Component({
    selector: "app-main-layout",
    templateUrl: "./main-layout.component.html",
    styleUrls: ["./main-layout.component.scss"],
    imports: [IonIcon, IonTabBar, IonTabButton, IonTabs]
})
export class MainLayoutComponent implements OnInit {
    constructor() {
        addIcons({ list, copy, settings, add, trash, alertCircleOutline });
    }

    ngOnInit() {}
}
