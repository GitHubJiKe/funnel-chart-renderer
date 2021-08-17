export type TData = {
    [x: string]: any;
};

export type TContainerOptions = {
    width?: number;
    height?: number;
    padding?: number[] | number | "auto";
};

export interface IFunnelOptions {
    data: TData[];
    xField?: string;
    yField?: string;
    legend?: boolean;
    tooltip?: boolean;
    containerOpts?: TContainerOptions;
}

export type EventName = "itemClick";
