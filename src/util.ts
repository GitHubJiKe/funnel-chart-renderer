export function px(val: string | number) {
    return `${val}px`;
}

export function setElementStyle(ele: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    for (const key in style) {
        const val = style[key];
        // @ts-ignore
        ele.style[key] = val;
    }
}

export function getLegendItem(opt: { val: string | number; text: string | number; bgColor: string; color?: string }) {
    const color = opt.color || "#ffffff";
    return `<div data-val=${opt.val} style="background-color:${opt.bgColor};color:${color};display:inline-block;margin:0 8px;border-radius:4px;padding:4px 8px;text-align:center;cursor:pointer;font-size:12px;white-space:nowrap;">${opt.text}</div>`;
}

export function createErrorEle(code: string, msg: string) {
    return `<div style="color:red;text-align:left;background-color:#eeeeee;padding:12px;">ErrorCode:${code}<br/>ErrorMsg:${msg}</div>`;
}
