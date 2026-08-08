import { Component, OnInit, ViewChild } from "@angular/core";
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonFab,
    IonFabButton,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    ToastController,
    AlertController,
    ModalController
} from "@ionic/angular/standalone";
import { DataStateComponent } from "src/app/shared/components/data-state/data-state.component";
import { CreateCategoryUseCase } from "../../../domain/usecases/create-category.usecase";
import { GetCategoriesUseCase } from "../../../domain/usecases/get-categories.usecase";
import { DeleteCategoryUseCase } from "../../../domain/usecases/delete-category.usecase";
import { UpdateCategoryUseCase } from "../../../domain/usecases/update-category.usecase";
import { Category } from "../../../domain/models/category.model";
import { CdkVirtualScrollViewport, ScrollingModule } from "@angular/cdk/scrolling";
import { CategoryCreationFormComponent } from "../../components/category-creation-form/category-creation-form.component";
@Component({
    selector: "app-categories",
    templateUrl: "./categories.page.html",
    styleUrls: ["./categories.page.scss"],
    standalone: true,
    imports: [
        ScrollingModule,
        IonLabel,
        IonItem,
        IonList,
        IonIcon,
        IonFabButton,
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        IonFab,
        DataStateComponent
    ]
})
export class CategoriesPage implements OnInit {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    presentingElement!: HTMLElement | null;

    categories: Category[] = [];

    constructor(
        private toastController: ToastController,
        private alertController: AlertController,
        private modalController: ModalController,
        private createCategoryUseCase: CreateCategoryUseCase,
        private getAllCategoriesUseCase: GetCategoriesUseCase,
        private deleteCategoryUseCase: DeleteCategoryUseCase,
        private updateCategoryUseCase: UpdateCategoryUseCase
    ) {}

    async ngOnInit() {
        this.presentingElement = document.querySelector(".page-content");
    }

    async ionViewWillEnter() {
        await this.loadCategories();
    }

    ionViewDidEnter() {
        if (this.viewport) {
            this.viewport.checkViewportSize();
        }
    }

    private async loadCategories() {
        try {
            this.categories = await this.getAllCategoriesUseCase.execute();
        } catch (error) {
            console.error("Error al cargar las tareas: ", error);
        }
    }

    async confirmDeleteCategory(categoryId: string, modal?: HTMLIonModalElement) {
        const alert = await this.alertController.create({
            header: "Confirmar eliminación",
            message: "¿Estás seguro de que deseas eliminar esta categoría?",
            buttons: [
                {
                    text: "Cancelar",
                    role: "cancel",
                    cssClass: "secondary"
                },
                {
                    text: "Eliminar",
                    role: "confirm",
                    handler: async () => {
                        if (modal) {
                            await modal.dismiss();
                        }
                        this.onDeleteCategory(categoryId);
                    }
                }
            ]
        });

        await alert.present();
    }

    async onDeleteCategory(categoryId: string) {
        try {
            await this.deleteCategoryUseCase.execute(categoryId);

            this.categories = this.categories.filter((t) => t.id !== categoryId);
            const toast = await this.toastController.create({
                message: "Categoría eliminada exitosamente",
                positionAnchor: "category-fab",
                duration: 2000
            });

            await toast.present();
        } catch (error) {
            console.error("Error al eliminar la categoría: ", error);
        }
    }

    async openModal(categoryToEdit?: Category) {
        const modal = this.modalController.create({
            component: CategoryCreationFormComponent,
            breakpoints: [0, 0.5],
            initialBreakpoint: 0.5,
            componentProps: {
                categoryToEdit: categoryToEdit,
                confirmDeleteCategory: async () => {
                    if (categoryToEdit?.id) {
                        this.confirmDeleteCategory(categoryToEdit.id, await modal);
                    }
                }
            }
        });

        (await modal).present();

        const { data, role } = await (await modal).onDidDismiss();

        if (role === "delete" && data?.id) {
            this.confirmDeleteCategory(data.id);
            return;
        }

        if (role === "confirm" && data) {
            if (categoryToEdit) {
                await this.updateCategoryUseCase.execute(data);
                this.categories = this.categories.map((t) => (t.id === data.id ? data : t));

                const toast = await this.toastController.create({
                    message: "Category actualizada exitosamente",
                    positionAnchor: "category-fab",
                    duration: 2000
                });

                await toast.present();
            } else {
                const newCategory = await this.createCategoryUseCase.execute(data);
                this.categories = [...this.categories, newCategory];

                const toast = await this.toastController.create({
                    message: "Categoría creada exitosamente",
                    positionAnchor: "category-fab",
                    duration: 2000
                });

                await toast.present();
            }
            setTimeout(() => this.viewport?.checkViewportSize(), 50);
        }
    }
}
