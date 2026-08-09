import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular/standalone";

@Injectable({
    providedIn: "root"
})
export class ToastService {
    constructor(private toastController: ToastController) {}

    async showToast(message: string, toastOptions?: { positionAnchor: string }) {
        const toast = await this.toastController.create({
            message,
            duration: 1200,
            positionAnchor: toastOptions?.positionAnchor
        });
        await toast.present();
    }
}
