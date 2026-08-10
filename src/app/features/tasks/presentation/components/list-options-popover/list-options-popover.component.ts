import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { IonItem, IonLabel, IonList, PopoverController, IonIcon } from "@ionic/angular/standalone";
import { ORDER_VIEW } from "../../constants/list-types";

@Component({
    selector: "app-list-options-popover",
    templateUrl: "./list-options-popover.component.html",
    imports: [IonIcon, CommonModule, IonList, IonItem, IonLabel],
    styleUrls: ["./list-options-popover.component.scss"]
})
export class ListOptionsPopoverComponent {
    @Input() selected = "";

    orderViews = ORDER_VIEW;

    constructor(private popoverCtrl: PopoverController) {}

    select(orderId: string) {
        this.popoverCtrl.dismiss(orderId);
    }
}
