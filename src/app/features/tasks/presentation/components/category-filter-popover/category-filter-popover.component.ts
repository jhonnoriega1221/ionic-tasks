import { Component, input, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonList, IonItem, IonLabel, PopoverController, IonIcon } from "@ionic/angular/standalone";
import { Category } from "src/app/features/categories/domain/models/category.model";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";
import { ColorDotComponent } from "src/app/shared/components/color-dot/color-dot.component";
import { DEFAULT_CATEGORY_COLOR } from "src/app/features/categories/presentation/constants/category-colors";

@Component({
    selector: "app-category-filter-popover",
    imports: [IonIcon, CommonModule, IonList, IonItem, IonLabel, ColorDotComponent],
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

    getCategoryColorId(categoryId: string): string {
        return (
            this.categoryFacade.categories().find((c) => c.id === categoryId)?.colorId ??
            DEFAULT_CATEGORY_COLOR.id
        );
    }
}
