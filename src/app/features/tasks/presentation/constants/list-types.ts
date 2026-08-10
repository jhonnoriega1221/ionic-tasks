export type OrderViewId = "my-order" | "date-order";

export interface OrderView {
    id: OrderViewId;
    name: string;
}

export const ORDER_VIEW: OrderView[] = [
    { id: "my-order", name: "Mi orden" },
    {
        id: "date-order",
        name: "Por fecha de creación"
    }
];

export const DEFAULT_ORDER_VIEW: OrderView = ORDER_VIEW[0];
