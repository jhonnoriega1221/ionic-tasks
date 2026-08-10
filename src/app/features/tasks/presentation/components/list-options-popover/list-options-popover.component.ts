import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { IonItem, IonLabel, IonList, PopoverController } from "@ionic/angular/standalone";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";
import { ORDER_VIEW } from "../../constants/list-types";

@Component({
    selector: "app-list-options-popover",
    templateUrl: "./list-options-popover.component.html",
    imports: [CommonModule, IonList, IonItem, IonLabel],
    styleUrls: ["./list-options-popover.component.scss"]
})
export class ListOptionsPopoverComponent {
    orderViews = ORDER_VIEW;

    constructor(private popoverCtrl: PopoverController) {}

    select(orderId: string) {
        this.popoverCtrl.dismiss(orderId);
    }
}
