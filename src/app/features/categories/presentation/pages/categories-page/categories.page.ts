import { Component, ViewChild } from "@angular/core";
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
    AlertController,
    ModalController
} from "@ionic/angular/standalone";
import { DataStateComponent } from "src/app/shared/components/data-state/data-state.component";
import { Category } from "../../../domain/models/category.model";
import { CdkVirtualScrollViewport, ScrollingModule } from "@angular/cdk/scrolling";
import { CategoryUpsertFormComponent } from "../../components/category-upsert-form/category-upsert-form.component";
import { CategoryFacadeService } from "../../facades/category-facade.service";
import { ToastService } from "src/app/shared/services/toast.service";
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
export class CategoriesPage {
    @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
    categories = this.categoryFacade.categories;

    constructor(
        private alertController: AlertController,
        private modalController: ModalController,
        private categoryFacade: CategoryFacadeService,
        private toastService: ToastService
    ) {}

    async ionViewWillEnter() {
        try {
            await this.categoryFacade.loadAll();
        } catch (error) {
            this.showToast("Error al cargar los datos");
        }
    }

    ionViewDidEnter() {
        if (this.viewport) {
            this.viewport.checkViewportSize();
        }
    }

    async confirmDeleteCategory(categoryId: string, modal?: HTMLIonModalElement) {
        const alert = await this.alertController.create({
            header: "Confirmar eliminación",
            message: "¿Estás seguro de que deseas eliminar esta categoría?",
            buttons: [
                {
                    text: "Cancelar"
                },
                {
                    text: "Eliminar",
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
            await this.categoryFacade.remove(categoryId);
            this.showToast("Categoría eliminada");
        } catch (error) {
            console.error("Error al eliminar categoría: ", error);
            this.showToast("Hubo un error al eliminar la categoría");
        }
    }

    async openModal(categoryToEdit?: Category) {
        const modal = this.modalController.create({
            component: CategoryUpsertFormComponent,
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

        // Acción que se realiza al hacer submit del formulario
        const { data, role } = await (await modal).onDidDismiss();
        if (role === "confirm" && data) {
            try {
                if (!!categoryToEdit) {
                    //Si se está editando categoría
                    await this.categoryFacade.update(data);
                    this.showToast("Categoría actualizada exitosamente");
                } else {
                    //Si se está creando categoría
                    await this.categoryFacade.create(data);
                    this.showToast("Categoría creada exitosamente");
                }
            } catch (error) {
                console.error("Error al guardar categoría:", error);
                this.showToast("Hubo un error al guardar la categoría");
            }
            setTimeout(() => this.viewport.checkViewportSize(), 50);
        }
    }

    private showToast(message: string) {
        this.toastService.showToast(message, { positionAnchor: "category-fab" });
    }
}
