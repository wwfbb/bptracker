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

    Chart.register(...registerables);
    Chart.defaults.color = "#fff";

    let bpContainerCanvas: HTMLCanvasElement;
    let hrContainerCanvas: HTMLCanvasElement;
    let bpChart: Chart;
    let hrChart: Chart;
    let chartInited = false;
    let fetchTimeFrame = TimeFrame.LAST_WEEK;

    function initializeCharts(data) {
        if (chartInited) {
            hrChart.destroy();
            bpChart.destroy();
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
                        label: "Systolic",
                        data: getSysValues(data),
                        fill: false,
                        tension: 0.1,
                    },
                    {
                        label: "Diastolic",
                        data: getDiaValues(data),
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
                        label: "Heart Rate",
                        data: getHrValues(data),
                        fill: false,
                        tension: 0.1,
                    },
                ],
            },
        });
    }

    onMount(() => {
        initializeCharts({});
    });

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
            bind:this={bpContainerCanvas}
            height={globalThis.vh * 40}
            width={globalThis.vw * 100}
        >
        </canvas>
    </div>

    <div class="hrContainer">
        <h2>Heart Rate</h2>
        <canvas
            bind:this={hrContainerCanvas}
            height={globalThis.vh * 40}
            width={globalThis.vw * 100}
        >
        </canvas>
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

    h1 {
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

    canvas {
        width: 100vw;
        margin: 5px;
    }
</style>
