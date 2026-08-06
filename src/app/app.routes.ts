import { Routes } from "@angular/router";
import { MainLayoutComponent } from "./layout/main/main-layout/main-layout.component";

export const routes: Routes = [
    {
        path: "",
        component: MainLayoutComponent,
        children: [
            {
                path: "",
                redirectTo: "todos",
                pathMatch: "full"
            },
            {
                path: "todos",
                loadComponent: () =>
                    import("./features/todos/presentation/pages/todos-page/todos.page").then(
                        (m) => m.TodosPage
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
