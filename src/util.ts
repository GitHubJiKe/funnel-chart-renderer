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
    return `<div class="legend-item-${opt.val}" data-val=${opt.val} style="background-color:${opt.bgColor};color:#fff;display:inline-block;margin-right:24px;border-radius:4px;padding:4px 12px;text-align:center;cursor:pointer;font-size:12px;white-space:nowrap;user-select:none;">${opt.text}</div>`;
}

export function createErrorEle(code: string, msg: string) {
    return `<div style="color:red;text-align:left;background-color:#eeeeee;padding:12px;">ErrorCode:${code}<br/>ErrorMsg:${msg}</div>`;
}

export function hexStringToRGB(hex: string) {
    let rgb = hex.match(/([\w\d]{2})/g)!.map(item => parseInt(item, 16));

    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
