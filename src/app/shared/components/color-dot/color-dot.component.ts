import { Component, computed, input } from "@angular/core";
import { getCategoryColorHexByColorId } from "../../utils/color.utils";

@Component({
    selector: "app-color-dot",
    standalone: true,
    template: `<span
        class="color-dot"
        [style.background-color]="colorHex()"
        [class.strip]="variant() === 'strip'"
    ></span>`,
    styles: [
        `
            .color-dot {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                &.strip {
                    width: 4px;
                    height: 40px;
                    border-radius: 50px;
                    margin-right: 6px;
                    position: absolute;
                    top: 4px;
                    left: 10px;
                }
            }
        `
    ]
})
export class ColorDotComponent {
    colorId = input.required<string>();
    variant = input<"dot" | "strip">("dot");

    colorHex = computed(() => getCategoryColorHexByColorId(this.colorId()));
}
