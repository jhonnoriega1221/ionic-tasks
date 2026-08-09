import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./layout/main/main-layout/main-layout.component";

export const routes: Routes = [
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            {
                path: "",
                redirectTo: "tasks",
                pathMatch: "full"
            },
            {
                path: "tasks",
                loadComponent: () =>
                    import("./features/tasks/presentation/pages/tasks-page/tasks.page").then(
                        (m) => m.TasksPage
                    )
            },
            {
                path: "categories",
                loadComponent: () =>
                    import("./features/categories/presentation/pages/categories-page/categories.page").then(
                        (m) => m.CategoriesPage
                    )
            },
            {
                path: "settings",
                loadComponent: () =>
                    import("./features/settings/presentation/pages/settings-page/settings.page").then(
                        (m) => m.SettingsPage
                    )
            }
        ]
    }
];
