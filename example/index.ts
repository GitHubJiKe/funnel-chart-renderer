import Funnel from "../src/Funnel";

function render() {
    const funnelPlot = new Funnel("funnel-root", {
        data: [
            { text: "第一层", value: 1000 },
            { text: "第二层", value: 900 },
            { text: "第三层", value: 800 },
            { text: "第四层", value: 700 },
            { text: "第五层", value: 600 },
            { text: "第六层", value: 500 },
            { text: "第七层", value: 400 },
            { text: "第八层", value: 300 },
            { text: "第九层", value: 200 },
            { text: "第十层", value: 100 },
            { text: "第十一层", value: 90 }
        ],
        xField: "text",
        yField: "value",
        legend: true,
        itemHeight: 40,
        tooltip: true,
        containerOpts: { width: 800, height: 600, padding: 8 }
    });

    funnelPlot.render();

    const itemClick = (data: unknown) => alert(JSON.stringify(data));

    funnelPlot.on("legendClick", itemClick);

    funnelPlot.on("itemClick", itemClick);

    let idx = 0;
    document.getElementById("switchTheme")!.addEventListener(
        "click",
        () => {
            if (idx % 2 === 0) {
                funnelPlot.update("theme2");
            } else {
                funnelPlot.update("theme1");
            }

            idx += 1;
        },
        false
    );
}

render();
