import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import {
    IonList,
    IonItem,
    IonLabel,
    IonCheckbox,
    IonReorderGroup,
    IonReorder,
    ItemReorderEventDetail
} from "@ionic/angular/standalone";
import { CdkVirtualScrollViewport, ScrollingModule } from "@angular/cdk/scrolling";
import { Task } from "../../../domain/models/task.model";
import { ColorDotComponent } from "src/app/shared/components/color-dot/color-dot.component";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";
import { DEFAULT_CATEGORY_COLOR } from "src/app/features/categories/presentation/constants/category-colors";

@Component({
    selector: "app-tasks-list",
    templateUrl: "./tasks-list.component.html",
    styleUrls: ["./tasks-list.component.scss"],
    imports: [
        IonReorder,
        IonReorderGroup,
        ScrollingModule,
        IonLabel,
        IonItem,
        IonList,
        IonCheckbox,
        ColorDotComponent
    ]
})
export class TasksListComponent {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

    @Input({ required: true }) tasks: Task[] = [];
    @Input() reorderDisabled: boolean = false;

    @Output() taskClick = new EventEmitter<Task>();
    @Output() toggleComplete = new EventEmitter<{ task: Task; isCompleted: boolean }>();
    @Output() reorder = new EventEmitter<CustomEvent<ItemReorderEventDetail>>();

    constructor(private categoryFacadeService: CategoryFacadeService) {}

    onItemClick(task: Task) {
        this.taskClick.emit(task);
    }

    onCheckboxChange(task: Task, event: any) {
        event.stopPropagation();
        this.toggleComplete.emit({ task, isCompleted: event.detail.checked });
    }

    onItemReorder(event: CustomEvent<ItemReorderEventDetail>) {
        this.reorder.emit(event);
    }

    checkViewportSize() {
        if (this.viewport) {
            this.viewport.checkViewportSize();
        }
    }

    getCategoryColorId(categoryId: string): string {
        return (
            this.categoryFacadeService.categories().find((c) => c.id === categoryId)?.colorId ??
            DEFAULT_CATEGORY_COLOR.id
        );
    }
}
