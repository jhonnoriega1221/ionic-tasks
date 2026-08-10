import { Component, input, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonList, IonItem, IonLabel, PopoverController, IonIcon } from "@ionic/angular/standalone";
import { Category } from "src/app/features/categories/domain/models/category.model";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";

@Component({
    selector: "app-category-filter-popover",
    imports: [IonIcon, CommonModule, IonList, IonItem, IonLabel],
    templateUrl: `./category-filter-popover.component.html`
})
export class CategoryFilterPopoverComponent {
    @Input() selected: string | undefined;
    categories = this.categoryFacade.categories;

    constructor(
        private popoverCtrl: PopoverController,
        private categoryFacade: CategoryFacadeService
    ) {}

    selectCategory(categoryId?: string) {
        this.popoverCtrl.dismiss(categoryId);
    }
}
