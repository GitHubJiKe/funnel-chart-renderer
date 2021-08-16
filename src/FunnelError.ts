type ErrorCode = "400" | "401";

const CodeMessage: Record<ErrorCode, string> = {
    "400": "传入容器ID有误，无法获取容器节点",
    "401": "数据过少，无法渲染图表"
};

export default class FunnelError extends Error {
    message: string;
    code: string;
    constructor(code: ErrorCode) {
        super();
        this.code = code;
        this.message = CodeMessage[code];
    }
}
