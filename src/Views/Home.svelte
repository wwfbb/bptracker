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

    let bpContainerCanvas: HTMLCanvasElement;
    let hrContainerCanvas: HTMLCanvasElement;
    let bpChart: Chart;
    let hrChart: Chart;
    let chartInited = false;
    let fetchTimeFrame = TimeFrame.LAST_WEEK;
    let showChart = false;
    let chartText = "Fetching data...";

    function initializeCharts(data) {
        if (chartInited) {
            hrChart.destroy();
            bpChart.destroy();
        }
        console.log(data)

        if (!data.labels.length) {
            showChart = false;
            chartText = "No data!";
            return;
        } else {
            showChart = true;
        }

        chartInited = true;
        const bpChartContext = bpContainerCanvas.getContext("2d");
        const hrChartContext = hrContainerCanvas.getContext("2d");

        bpChart = new Chart(bpChartContext, {
            type: "line",
            data: {
                labels: getLabels(data),
                datasets: [
                    {
                        label: "Systolic - Morning",
                        data: getSysValues(data).morning,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Diastolic - Morning",
                        data: getDiaValues(data).morning,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Systolic - Afternoon",
                        data: getSysValues(data).afternoon,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Diastolic - Afternoon",
                        data: getDiaValues(data).afternoon,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Systolic - Night",
                        data: getSysValues(data).night,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Diastolic - Night",
                        data: getDiaValues(data).night,
                        fill: false,
                        tension: 0.1,
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
                        label: "Heart Rate - Morning",
                        data: getHrValues(data).morning,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Heart Rate - Afternoon",
                        data: getHrValues(data).afternoon,
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Heart Rate - Night",
                        data: getHrValues(data).night,
                        fill: false,
                        tension: 0.1,
                    }
                ],
            },
        });
    }

    // onMount(() => {
    //     initializeCharts({});
    // });

    $: {
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
        <h2>Blood Pressure</h2>
        <canvas
            style={`display: ${showChart ? "flex" : "none"};`}
            class="canvas"
            bind:this={bpContainerCanvas}
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
        <canvas
            style={`display: ${showChart ? "flex" : "none"};`}
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
        margin: 8px 0;
        color: #333;
        outline: none;
    }

    .padded {
        padding: 32px;
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
        margin-bottom: 16px;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    }

    h2 {
        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    }

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
