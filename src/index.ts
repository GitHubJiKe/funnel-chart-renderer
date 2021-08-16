import { defaultThemes } from "./constant";
import FunnelError from "./FunnelError";
import { IFunnelOptions, TData, TContainerOptions, TShapeOptions, EventName } from "./types";
import { createErrorEle, getLegendItem, px, setElementStyle } from "./util";
export default class Funnel {
    private eleId: string;
    private opts: IFunnelOptions;
    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private colorIdx = 0;
    private itemHeight = 80;
    private points: number[][][] = [];
    private colors: string[] = defaultThemes.theme1;
    private container: HTMLDivElement;
    private tooltip: HTMLDivElement;
    private legendEvents: Array<any> = [];
    private canvasEvents: Array<any> = [];
    private curHoverIdx: number | undefined;
    private data: TData[];
    private dom: HTMLElement;

    private containerOpts: TContainerOptions = {
        width: 400,
        height: 400,
        padding: 8
    };

    private shapeOpts: TShapeOptions = {
        maxSize: 1,
        minSize: 1
    };

    constructor(eleId: string, opts: IFunnelOptions) {
        this.eleId = eleId;
        this.opts = opts;

        if (opts.containerOpts) {
            this.containerOpts = { ...this.containerOpts, ...opts.containerOpts };
        }

        if (opts.shapeOpts) {
            this.shapeOpts = { ...this.shapeOpts, ...opts.shapeOpts };
        }

        if (this.opts.itemHeight) {
            this.itemHeight = this.opts.itemHeight;
        }
    }

    private setDomStyle() {
        if (this.dom) {
            const { width, height, padding } = this.containerOpts;
            this.dom.style.width = px(width!);
            this.dom.style.height = px(height!);

            if (padding) {
                if (padding === "auto") {
                    this.dom.style.padding = "auto";
                } else if (Array.isArray(padding)) {
                    this.dom.style.padding = padding.map(v => px(v)).join("");
                } else {
                    this.dom.style.padding = px(padding!);
                }
            }
        }
    }

    private getData() {
        const { data, xField = "text", yField = "value" } = this.opts;
        return data
            .map(v => {
                return { text: v[xField], value: v[yField] };
            })
            .sort((v1, v2) => Number(v2.value) - Number(v1.value));
    }

    private onLegendClick(e: Event) {
        // @ts-ignore
        const val = e.target.dataset["val"];
        const d = this.data.find(d => d[this.opts.yField!] === Number(val));
        this.legendEvents.forEach(cb => cb(d));
    }

    private onCanvasHover(e: any) {
        this.points.forEach((point, idx) => {
            const lt = point[0];
            const rt = point[1];
            const rb = point[2];
            if (e.layerX > lt[0] && e.layerX < rt[0] && e.layerY > lt[1] && e.layerY < rb[1]) {
                this.showTooltip(e.layerX, e.layerY, this.data[idx]);
                this.curHoverIdx = idx;
            }
        });

        const curPoints = this.points[this.curHoverIdx!];

        if (curPoints) {
            const lt = curPoints[0];
            const rt = curPoints[1];
            const rb = curPoints[2];
            if (e.layerX > lt[0] && e.layerX < rt[0] && e.layerY > lt[1] && e.layerY < rb[1]) {
                this.showTooltip(e.layerX, e.layerY, this.data[this.curHoverIdx!]);
            } else {
                this.hideTooltip();
            }
        }
    }

    private showTooltip(x: number, y: number, data: { [x: string]: unknown }) {
        if (this.tooltip) {
            this.tooltip.innerText = `${data[this.opts.xField!]} ~ ${data[this.opts.yField!]}`;
            this.tooltip.style.visibility = "visible";
            this.tooltip.style.top = `${y}px`;
            this.tooltip.style.left = `${x + 200}px`;
        }
    }

    private hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style.visibility = "hidden";
        }
    }

    private createLegend() {
        const legend = document.createElement("div");

        setElementStyle(legend, {
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            margin: px(12)
        });

        legend.addEventListener("click", this.onLegendClick.bind(this), false);

        legend.innerHTML = this.opts.data
            .map((v, idx) => {
                const text = v[this.opts.xField!];
                const val = v[this.opts.yField!];
                let index = idx;

                if (idx === this.colors.length) {
                    index = 0;
                }

                const bgColor = this.colors[index];

                return getLegendItem({ val, text, bgColor });
            })
            .join("");

        return legend;
    }

    private onCanvasClick(e: any) {
        this.points.forEach((point, idx) => {
            const lt = point[0];
            const rt = point[1];
            const rb = point[2];
            if (e.layerX > lt[0] && e.layerX < rt[0] && e.layerY > lt[1] && e.layerY < rb[1]) {
                this.canvasEvents.forEach(cb => cb(this.data[idx]));
            }
        });
    }

    private setCanvasEventListener() {
        if (this.canvas) {
            const onClick = this.onCanvasClick.bind(this);
            this.canvas.addEventListener("click", onClick, false);

            const onHover = this.onCanvasHover.bind(this);

            this.canvas.addEventListener(
                "mouseenter",
                () => {
                    this.canvas.addEventListener("mousemove", onHover, false);
                },
                false
            );
            this.canvas.addEventListener(
                "mouseleave",
                () => {
                    this.canvas.removeEventListener("mousemove", onHover, false);
                },
                false
            );
        }
    }

    private getTextX() {
        const w = this.opts.containerOpts?.width || 400;
        return w / 2;
    }

    private drawPolygon(points: number[][], text: string | number) {
        const height = points[2][1];

        if (this.colorIdx === this.colors.length) {
            this.colorIdx = 0;
        }

        this.ctx.fillStyle = this.colors[this.colorIdx];
        this.ctx.strokeStyle = "#fff";
        this.ctx.beginPath();
        this.ctx.moveTo(points[0][0], points[0][1]);
        this.ctx.lineTo(points[1][0], points[1][1]);
        this.ctx.lineTo(points[2][0], height);

        if (points.length > 3) {
            this.ctx.lineTo(points[3][0], points[3][1]);
        }

        this.ctx.lineTo(points[0][0], points[0][1]);
        this.ctx.fill();
        this.ctx.font = "14px 宋体";

        const textW = this.ctx.measureText(String(text)).width;
        let textX = this.getTextX();

        textX = textX - textW / 2;

        this.ctx.strokeText(String(text), textX, height - this.itemHeight / 2.4, textW);
        this.ctx.stroke();
        this.colorIdx += 1;
    }

    private setCanvasStyle() {
        if (this.canvas) {
            const { width, height } = this.containerOpts;
            this.canvas.width = width!;
            this.canvas.height = height!;
            this.canvas.style.cursor = "pointer";
        }
    }

    render() {
        const dom = document.getElementById(this.eleId);

        if (!dom) {
            const error = new FunnelError("400");
            throw error;
        }

        this.dom = dom;
        this.setDomStyle();

        this.canvas = document.createElement("canvas");
        this.setCanvasStyle();
        this.setCanvasEventListener();

        this.ctx = this.canvas.getContext("2d")!;

        this.container = document.createElement("div");

        setElementStyle(this.container, { width: "100%", height: "100%", position: "relative" });

        if (this.opts.legend) {
            this.container.append(this.createLegend());
        }

        this.container.append(this.canvas);

        if (this.opts.tooltip) {
            this.tooltip = this.createToolTip();
            this.container.append(this.tooltip);
        }

        this.dom.append(this.container);

        this.data = this.getData();

        if (this.data.length < 2) {
            const error = new FunnelError("401");
            this.container.innerHTML = createErrorEle(error.code, error.message);
            throw error;
        }

        this.points = this.getPoints();

        this.points.forEach((ps, idx) => {
            this.drawPolygon(ps, this.data[idx].text);
        });
    }

    private getPoints() {
        const data = this.data;
        const canvasWidth = this.canvas.width;
        const points: number[][][] = [];

        for (let index = 0; index < data.length; index++) {
            const point: number[][] = [];
            const cur = data[index];
            const cv = Number(cur.value);
            const w = (cv * canvasWidth * 0.8) / 1000;
            const offset = (canvasWidth - w) / 2;
            if (index === 0) {
                point.push([offset, 0]);
                point.push([offset + w, 0]);
            } else {
                point.push([offset, this.itemHeight * index]);
                point.push([offset + w, this.itemHeight * index]);
            }
            points.push(point);
        }

        const ps = points.map((point, idx) => {
            const nextP = points[idx + 1];
            const prevP = points[idx - 1];
            const prevD = data[idx - 1];
            const curD = data[idx];

            if (nextP) {
                point.push(nextP[1], nextP[0]);
            } else {
                if (prevD.value === curD.value) {
                    point.push(
                        [prevP[2][0], prevP[2][1] + this.itemHeight],
                        [prevP[3][0], prevP[3][1] + this.itemHeight]
                    );
                } else {
                    point.push([canvasWidth / 2, point[0][1] + this.itemHeight]);
                }
            }

            return point;
        });

        return ps;
    }

    update(key?: string) {
        if (key) {
            const newTheme = defaultThemes[key as "theme1" | "theme2"];
            if (newTheme) this.colors = newTheme;
        }

        this.clear();
        this.render();
    }

    private createToolTip() {
        const tooltip = document.createElement("div");

        setElementStyle(tooltip, {
            position: "absolute",
            width: "auto",
            backgroundColor: "#fff",
            border: "1px solid #eeeeee",
            borderRadius: px(4),
            padding: px(12),
            whiteSpace: "nowrap",
            visibility: "hidden"
        });

        return tooltip;
    }

    private clear() {
        this.colorIdx = 0;
        this.dom.removeChild(this.container!);
    }

    on(eventName: EventName, cb: (data: TData) => void) {
        if (eventName === "legendClick") {
            this.legendEvents.push(cb);
        }

        if (eventName === "itemClick") {
            this.canvasEvents.push(cb);
        }
    }

    off(eventName: EventName, cb: (data: TData) => void) {
        if (eventName === "itemClick") {
            const idx = this.canvasEvents.findIndex(v => v === cb);
            if (idx > -1) {
                this.canvasEvents.splice(idx, 1);
            }
        }

        if (eventName === "legendClick") {
            const idx = this.legendEvents.findIndex(v => v === cb);
            if (idx > -1) {
                this.legendEvents.splice(idx, 1);
            }
        }
    }
}
