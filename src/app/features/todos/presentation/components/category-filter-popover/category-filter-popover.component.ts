import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonList, IonItem, IonLabel, PopoverController } from "@ionic/angular/standalone";
import { Category } from "src/app/features/categories/domain/models/category.model";

@Component({
    selector: "app-category-filter-popover",
    standalone: true,
    imports: [CommonModule, IonList, IonItem, IonLabel],
    template: `
        <ion-list>
            <ion-item button (click)="selectCategory('')">
                <ion-label>Todas las categorías</ion-label>
            </ion-item>
            @for (category of categories; track category.id) {
                <ion-item button (click)="selectCategory(category.id)">
                    <ion-label>{{ category.name }}</ion-label>
                </ion-item>
            }
        </ion-list>
    `
})
export class CategoryFilterPopoverComponent {
    @Input() categories: Category[] = [];
    @Input() selectedCategoryId: string = "";

    constructor(private popoverCtrl: PopoverController) {}

    selectCategory(categoryId: string) {
        this.popoverCtrl.dismiss(categoryId);
    }
}
