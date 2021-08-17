export type TData = {
    [x: string]: string | number;
};

export type TContainerOptions = {
    width?: number;
    height?: number;
    padding?: number[] | number | "auto";
};

export type TShapeOptions = {
    maxSize?: number;
    minSize?: number;
    color?: string[] | string | Function;
};

export interface IFunnelOptions {
    data: TData[];
    xField?: string;
    yField?: string;
    legend?: boolean;
    tooltip?: boolean;
    containerOpts?: TContainerOptions;
    shapeOpts?: TShapeOptions;
}

export type EventName = "itemClick";
