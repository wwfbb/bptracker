<script lang="ts">
    import { Chart, registerables } from "chart.js";
    import { onMount } from "svelte";
    import {
        TimeFrame,
        fetchData,
        getDiaValues,
        getHrValues,
        getLabels,
        getSysValues,
    } from "../lib/data_fetch";
    import { pruneData } from "../lib/prune";

    Chart.register(...registerables);
    Chart.defaults.color = "#fff";

    let bpSysContainerCanvas: HTMLCanvasElement;
    let bpDiaContainerCanvas: HTMLCanvasElement;
    let hrContainerCanvas: HTMLCanvasElement;
    let bpSysChart: Chart;
    let bpDiaChart: Chart;
    let hrChart: Chart;
    let chartInited = false;
    let fetchTimeFrame = TimeFrame.LAST_WEEK;
    let showChart = false;
    let chartText = "Fetching data...";

    function initializeCharts(data) {
        console.log("==== CHANGED ====", data.labels.length, showChart ? "flex" : "none")
        if (chartInited) {
            hrChart.destroy();
            bpSysChart.destroy();
            bpDiaChart.destroy();
        }
        console.log(data)

        if (data.labels.length === 0) {
            showChart = false;
            chartText = "No data!";
            console.log("No data!")
            return;
        }
        showChart = true;
        chartDisplayStyle = "display: block";
        console.log("Reach")

        chartInited = true;
        const bpSysChartContext = bpSysContainerCanvas.getContext("2d");
        const bpDiaChartContext = bpDiaContainerCanvas.getContext("2d");
        const hrChartContext = hrContainerCanvas.getContext("2d");

        bpSysChart = new Chart(bpSysChartContext, {
            type: "line",
            data: {
                labels: getLabels(data),
                datasets: [
                    {
                        label: "Morning",
                        data: getSysValues(data).morning,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#DA012D",
                        borderWidth: 0.5,
                    },
                    {
                        label: "Afternoon",
                        data: getSysValues(data).afternoon,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#960018",
                        borderWidth: 0.5,
                    },
                    {
                        label: "Night",
                        data: getSysValues(data).night,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#722F37",
                        borderWidth: 0.5,
                    },
                ],
            },
        });

        bpDiaChart = new Chart(bpDiaChartContext, {
            type: "line",
            data: {
                labels: getLabels(data),
                datasets: [
                    {
                        label: "Morning",
                        data: getDiaValues(data).morning,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#00FFEF",
                        borderWidth: 0.5,

                    },
                    {
                        label: "Afternoon",
                        data: getDiaValues(data).afternoon,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#007FFF",
                        borderWidth: 0.5,
                    },
                    {
                        label: "Night",
                        data: getDiaValues(data).night,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#191970",
                        borderWidth: 0.5,
                    },
                ],
            },
        });

        hrChart = new Chart(hrChartContext, {
            type: "line",
            data: {
                labels: getLabels(data),
                datasets: [
                    {
                        label: "Morning",
                        data: getHrValues(data).morning,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#37FD12",
                        borderWidth: 0.5,
                    },
                    {
                        label: "Afternoon",
                        data: getHrValues(data).afternoon,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#C7EA46",
                        borderWidth: 0.5,
                    },
                    {
                        label: "Night",
                        data: getHrValues(data).night,
                        fill: false,
                        tension: 0.1,
                        borderColor: "#2E8B57",
                        borderWidth: 0.5,

                    }
                ],
            },
        });
    }

    // onMount(() => {
    //     initializeCharts({});
    // });

    let chartDisplayStyle = ""

    $: {
        chartDisplayStyle = "display: none;";
        showChart = false;
        chartText = "Fetching...."
        fetchData(fetchTimeFrame).then(initializeCharts);
    }
</script>

<main>
    <div class="padded">
        <div class="titleContainer">
            <h1>Home</h1>
        </div>

        <div class="selectionContainer">
            <select bind:value={fetchTimeFrame}>
                <option value={TimeFrame.LAST_WEEK}>Last Week</option>
                <option value={TimeFrame.LAST_MONTH}>Last Month</option>
                <option value={TimeFrame.LAST_3MONTH}>Last 3 Months</option>
            </select>
        </div>
    </div>

    <div class="bpContainer">
        <h2>Systolic Blood Pressure</h2>
        <!-- Don't use string interpolation, it messes with reactivity -->
        <canvas
            style={chartDisplayStyle} 
            class="canvas"
            bind:this={bpSysContainerCanvas}
            height={globalThis.vh * 40}
            width={globalThis.vw * 100}
        >
        </canvas>
        {#if !showChart}
            <div class="canvas nodata">
                <h2>{chartText}</h2>
            </div>
        {/if}
    </div>

    <div class="bpContainer">
        <h2>Diastolic Blood Pressure</h2>
        <!-- Don't use string interpolation, it messes with reactivity -->
        <canvas
            style={chartDisplayStyle} 
            class="canvas"
            bind:this={bpDiaContainerCanvas}
            height={globalThis.vh * 40}
            width={globalThis.vw * 100}
        >
        </canvas>
        {#if !showChart}
            <div class="canvas nodata">
                <h2>{chartText}</h2>
            </div>
        {/if}
    </div>

    <div class="hrContainer">
        <h2>Heart Rate</h2>
        <!-- Don't use string interpolation, it messes with reactivity -->
        <canvas
            style={chartDisplayStyle}
            class="canvas"
            bind:this={hrContainerCanvas}
            height={globalThis.vh * 40}
            width={globalThis.vw * 100}
        >
        </canvas>

        {#if !showChart}
            <div class="canvas nodata">
                <h2>{chartText}</h2>
            </div>
        {/if}
    </div>
</main>

<style>
    select {
        width: 100%;
        border: none;
        border-radius: 5px;
        font-size: 110%;
        padding: 10px 16px;
        /* margin: 8px 0; */
        color: #333;
        outline: none;
    }

    .padded {
        padding: 8px 32px;
    }

    h2 {
        padding: 0 32px;
    }

    main {
        color: #fff;
    }

    h1,
    h2 {
        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        /* margin-bottom: 8px; */
        font-style: normal;
        font-variation-settings: "wdth" 100;
        font-weight: 400;
    }

    /* h2 {
        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    } */

    .canvas {
        width: 100%;
        margin: 5px;
        height: 25vh;
    }

    .nodata {
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
