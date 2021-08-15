type TData = {
    [x: string]: string | number;
};

type TContainerOptions = {
    width?: number;
    height?: number;
    padding?: number[] | number | "auto";
};

type TShapeOptions = {
    maxSize?: number;
    minSize?: number;
    color?: string[] | string | Function;
};

interface IFunnelOptions {
    data: TData[];
    xField?: string;
    yField?: string;
    legend?: boolean;
    tooltip?: boolean;
    itemHeight?: number;
    containerOpts?: TContainerOptions;
    shapeOpts?: TShapeOptions;
}

const defaultThemes = {
    theme1: [
        "#5B8FF9",
        "#61DDAA",
        "#65789B",
        "#F6BD16",
        "#7262fd",
        "#78D3F8",
        "#9661BC",
        "#F6903D",
        "#008685",
        "#F08BB4"
    ],
    theme2: [
        "#5B8FF9",
        "#CDDDFD",
        "#CDF3E4",
        "#CED4DE",
        "#FCEBB9",
        "#D3CEFD",
        "#D3EEF9",
        "#DECFEA",
        "#FFE0C7",
        "#BBDEDE",
        "#FFE0ED"
    ]
};

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
    private data: any[];
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

    private getDivElement(id: string) {
        return document.getElementById(id);
    }

    private setDomStyle(dom: HTMLElement | null) {
        if (dom) {
            dom.style.width = `${this.containerOpts.width}px`;
            dom.style.height = `${this.containerOpts.height}px`;
            dom.style.padding = `${this.containerOpts.padding}px`;
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
        legend.style.display = "flex";
        legend.style.flexDirection = "row";
        legend.style.justifyContent = "center";
        legend.style.alignItems = "center";
        legend.style.margin = "12px";
        legend.addEventListener("click", this.onLegendClick.bind(this), false);
        const innerHTML = this.opts.data
            .map((v, idx) => {
                const text = v[this.opts.xField!];
                const val = v[this.opts.yField!];
                let index = idx;
                if (idx === this.colors.length) {
                    index = 0;
                }
                return `<div data-val="${val}" style="background-color:${this.colors[index]};display:inline-block;margin:0 8px;border-radius:4px;padding:4px 8px;text-align:center;cursor:pointer;font-size:12px;white-space:nowrap;">${text}</div>`;
            })
            .join("");

        legend.innerHTML = innerHTML;
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

    private createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = this.opts.containerOpts?.width!;
        canvas.height = this.opts.containerOpts?.height!;
        canvas.style.cursor = "pointer";
        const onHover = this.onCanvasHover.bind(this);
        canvas.addEventListener(
            "mouseenter",
            () => {
                canvas.addEventListener("mousemove", onHover, false);
            },
            false
        );

        const onClick = this.onCanvasClick.bind(this);

        canvas.addEventListener("click", onClick, false);

        canvas.addEventListener(
            "mouseleave",
            () => {
                canvas.removeEventListener("mousemove", onHover);
            },
            false
        );

        return canvas;
    }

    private createDiv() {
        const div = document.createElement("div");
        div.style.position = "relative";
        div.style.width = "100%";
        div.style.height = "100%";

        return div;
    }

    private getTextX() {
        const w = this.opts.containerOpts?.width || 400;
        return w / 2;
    }

    private drawPolygon(points: number[][], text: string) {
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

        const textW = this.ctx.measureText(text).width;
        let textX = this.getTextX();

        textX = textX - textW / 2;

        this.ctx.strokeText(text, textX, height - this.itemHeight / 2.4, textW);
        this.ctx.stroke();
        this.colorIdx += 1;
    }

    render() {
        const dom = this.getDivElement(this.eleId);
        this.setDomStyle(dom);
        const canvas = this.createCanvas();
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");
        this.ctx = ctx!;
        const div = this.createDiv();
        if (this.opts.legend) {
            const legend = this.createLegend();
            div.append(legend);
        }

        div?.append(canvas);
        this.container = div;

        if (this.opts.tooltip) {
            const tooltip = this.createToolTip();
            this.tooltip = tooltip;
            div.append(tooltip);
        }

        dom?.append(div);

        const points = this.getPoints();
        this.points = points;
        const data = this.getData();

        points.forEach((ps, idx) => {
            this.drawPolygon(ps, data[idx].text as string);
        });
    }

    private getPoints() {
        const data = this.getData();
        this.data = data;
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

    update(color: "theme1" | "theme2") {
        this.colors = defaultThemes[color];
        this.clear();
        this.render();
    }

    private createToolTip() {
        const tooltip = document.createElement("div");
        tooltip.style.backgroundColor = "#fff";
        tooltip.style.border = "1px solid #eeeeee";
        tooltip.style.borderRadius = "4px";
        tooltip.style.padding = "12px";
        tooltip.style.width = "auto";
        tooltip.style.whiteSpace = "nowrap";
        tooltip.style.position = "absolute";
        tooltip.style.visibility = "hidden";
        return tooltip;
    }

    private clear() {
        this.colorIdx = 0;

        const dom = this.getDivElement(this.eleId);

        dom?.removeChild(this.container!);
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

type EventName = "legendClick" | "itemClick";
