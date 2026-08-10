import { Component, forwardRef } from "@angular/core";
import { IonGrid, IonButton, IonCol, IonRow } from "@ionic/angular/standalone";
import { CATEGORY_COLOR_PALETTE, DEFAULT_CATEGORY_COLOR } from "../../constants/category-colors";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

interface CategoryColor {
    name: string;
    hex: string;
}

@Component({
    selector: "app-color-picker",
    templateUrl: "./color-picker.component.html",
    styleUrls: ["./color-picker.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ColorPickerComponent),
            multi: true
        }
    ],
    imports: [IonRow, IonCol, IonGrid, IonButton]
})
export class ColorPickerComponent implements ControlValueAccessor {
    colors = CATEGORY_COLOR_PALETTE;
    selectedColor: string = DEFAULT_CATEGORY_COLOR.id;
    disabled = false;

    private onChange: (value: string) => void = () => {};
    private onTouched: () => void = () => {};

    select(colorId: string) {
        if (this.disabled) return;
        this.selectedColor = colorId;
        this.onChange(colorId);
        this.onTouched();
    }

    writeValue(value: string): void {
        this.selectedColor = value ?? DEFAULT_CATEGORY_COLOR.id;
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
