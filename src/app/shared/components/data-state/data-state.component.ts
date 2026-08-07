import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { IonButton, IonIcon } from "@ionic/angular/standalone";

type DataStateVariant = "empty" | "error" | "info";

@Component({
    selector: "app-data-state",
    templateUrl: "./data-state.component.html",
    styleUrls: ["./data-state.component.scss"],
    imports: [CommonModule, IonIcon, IonButton]
})
export class DataStateComponent {
    @Input() icon = "alert-cicle-outline";
    @Input() title = "";
    @Input() subtitle = "";
    @Input() variant: DataStateVariant = "empty";
    @Input() buttonLabel?: string;
    @Input() buttonColor: "primary" | "danger" | "success" | "medium" | "dark" | "light" =
        "primary";
    @Input() buttonAction?: () => void;

    get showButton(): boolean {
        return Boolean(this.buttonLabel || this.buttonAction);
    }

    handleButtonClick(): void {
        this.buttonAction?.();
    }
}
