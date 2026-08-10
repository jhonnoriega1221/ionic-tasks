import {
    Component,
    computed,
    EventEmitter,
    input,
    Input,
    OnInit,
    output,
    Output
} from "@angular/core";
import { Task } from "../../../domain/models/task.model";
import { IonList, IonListHeader, IonLabel, IonItem } from "@ionic/angular/standalone";
import { IonicModule } from "@ionic/angular";
import { CategoryFacadeService } from "src/app/features/categories/presentation/facades/category-facade.service";
import { ColorDotComponent } from "src/app/shared/components/color-dot/color-dot.component";
import { DEFAULT_CATEGORY_COLOR } from "src/app/features/categories/presentation/constants/category-colors";

export interface TaskGroup {
    dateKey: string;
    label: string;
    tasks: Task[];
}

@Component({
    selector: "app-date-tasks-list",
    templateUrl: "./date-tasks-list.component.html",
    styleUrls: ["./date-tasks-list.component.scss"],
    imports: [IonicModule, ColorDotComponent]
})
export class DateTasksListComponent {
    tasks = input.required<Task[]>();
    taskClick = output<Task>();
    toggleComplete = output<{ task: Task; isCompleted: boolean }>();

    groups = computed(() => this.groupTasksByDate(this.tasks()));

    constructor(private categoryFacadeService: CategoryFacadeService) {}

    groupTasksByDate(tasks: Task[]): TaskGroup[] {
        const groups = new Map<string, Task[]>();

        for (const task of tasks) {
            const dateKey = this.toLocalDateKey(task.createdAt);
            const group = groups.get(dateKey) ?? [];
            group.push(task);
            groups.set(dateKey, group);
        }

        return Array.from(groups.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([dateKey, tasks]) => ({
                dateKey,
                label: new Date(dateKey).toLocaleDateString("es-CO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }),
                tasks
            }));
    }

    toLocalDateKey(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    getCategoryColorId(categoryId: string): string {
        return (
            this.categoryFacadeService.categories().find((c) => c.id === categoryId)?.colorId ??
            DEFAULT_CATEGORY_COLOR.id
        );
    }

    onCheckboxChange(task: Task, event: any) {
        event.stopPropagation();
        this.toggleComplete.emit({ task, isCompleted: event.detail.checked });
    }
}
