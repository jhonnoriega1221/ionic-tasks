import {
    CATEGORY_COLOR_PALETTE,
    DEFAULT_CATEGORY_COLOR
} from "src/app/features/categories/presentation/constants/category-colors";

export function getCategoryColorHexByColorId(colorId: string) {
    const color = CATEGORY_COLOR_PALETTE.find((c) => c.id === colorId);
    return color ? color.hex : DEFAULT_CATEGORY_COLOR.hex;
}
