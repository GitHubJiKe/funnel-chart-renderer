import Funnel from "../src";

function render() {
    const funnelPlot = new Funnel("funnel-root", {
        data: [
            { text: "投递", value: 100 },
            { text: "初筛", value: 80 },
            { text: "一面", value: 50 },
            { text: "二面", value: 20 },
            { text: "三面", value: 5 },
            { text: "录用", value: 3 }
        ]
    });

    funnelPlot.render();

    const itemClick = (data: unknown) => alert(JSON.stringify(data));

    funnelPlot.on("itemClick", itemClick);
}

render();
