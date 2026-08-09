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

@Component({
    selector: "app-tasks-list",
    templateUrl: "./tasks-list.component.html",
    styleUrls: ["./tasks-list.component.scss"],
    imports: [IonReorder, IonReorderGroup, ScrollingModule, IonLabel, IonItem, IonList, IonCheckbox]
})
export class TasksListComponent implements OnInit {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

    @Input({ required: true }) tasks: Task[] = [];
    @Input() reorderDisabled: boolean = false;

    @Output() taskClick = new EventEmitter<Task>();
    @Output() toggleComplete = new EventEmitter<{ task: Task; isCompleted: boolean }>();
    @Output() reorder = new EventEmitter<CustomEvent<ItemReorderEventDetail>>();

    constructor() {}

    ngOnInit() {}

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
}
