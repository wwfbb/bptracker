<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import {
        hideNavBar,
        currentPageId,
        Screen,
        recordToEdit,
    } from "../lib/navigation";
    import { DateTime } from "luxon";
    import { getPage, deleteRecordServer } from "../lib/raw_data_pull";
    import { Time } from "../lib/data_fetch";
    import { scale } from "svelte/transition";

    const BP_SYS_UPPER_LIMIT = 140;
    const BP_SYS_LOWER_LIMIT = 110;
    const BP_DIA_UPPER_LIMIT = 85;
    const BP_DIA_LOWER_LIMIT = 50;
    const HR_UPPER_LIMIT = 90;
    const HR_LOWER_LIMIT = 60;

    onMount(() => {
        hideNavBar.set(true);
        console.log("Hiding");
    });

    onDestroy(() => {
        hideNavBar.set(false);
    });

    let records = [];
    let page = 0;
    let loadMoreDisabled = false;

    enum Tint {
        BP_SYS,
        BP_DIA,
        HR,
    }

    async function loadMore() {
        loadMoreDisabled = true;
        page++;
        let newRecords = await getPage(page);
        records = [...records, ...newRecords];
        if (newRecords.length === 0) {
            alert("No more records");
        } else {
            loadMoreDisabled = false;
        }
    }

    function getTint(type: Tint, value: number) {
        if (type == Tint.BP_SYS) {
            if (value > BP_SYS_UPPER_LIMIT) return "high";
            if (value < BP_SYS_LOWER_LIMIT) return "low";
        } else if (type == Tint.BP_DIA) {
            if (value > BP_DIA_UPPER_LIMIT) return "high";
            if (value < BP_DIA_LOWER_LIMIT) return "low";
        } else if (type == Tint.HR) {
            if (value > HR_UPPER_LIMIT) return "high";
            if (value < HR_LOWER_LIMIT) return "low";
        }

        return "";
    }

    function getTimeStringFromTime(time) {
        switch (+time) {
            case Time.MORNING:
                return "Morning";
            case Time.AFTERNOON:
                return "Afternoon";
            case Time.EVENING:
                return "Evenng";
            case Time.NIGHT:
                return "Night";
            default:
                return time;
        }
    }

    async function deleteRecord(idx: number) {
        if (!confirm("Are you sure you want to delete this record?")) {
            return;
        }

        let recordId = records[idx].id;
        await deleteRecordServer(recordId);

        records.splice(idx, 1);
        records = records;
    }

    loadMore();

    function editRecord(idx: number) {
        recordToEdit.set(records[idx]);
        currentPageId.set(Screen.EDIT_RECORD);
    }
</script>

<main>
    <div class="topContainer">
        <h1>Raw Data</h1>

        <button
            class="close"
            on:click={() => {
                currentPageId.set(Screen.SYNC_DETAILS);
            }}
            >&#x2715;
        </button>
    </div>

    <div class="scrollable">
        {#each records as record, c}
            <div class="record" transition:scale>
                <div class="row">
                    <div class="left">
                        {DateTime.fromSQL(record.date).toLocaleString(
                            DateTime.DATE_FULL,
                        )}
                    </div>
                    <div class="right">
                        {getTimeStringFromTime(record.time)}
                    </div>
                </div>

                <div class="row">
                    <div class="left">
                        <span class={getTint(Tint.BP_SYS, record.value_sys)}
                            >{record.value_sys}s</span
                        >
                        /
                        <span class={getTint(Tint.BP_DIA, record.value_dia)}>
                            {record.value_dia}</span
                        >
                        (S/D)
                    </div>
                    <div class="right">
                        <span class={getTint(Tint.HR, record.heart_rate)}>
                            {record.heart_rate}
                        </span>
                        (HR)
                    </div>
                </div>
                {#if record.comment}
                    <div class="row">
                        <div class="left">
                            {record.comment}
                        </div>
                    </div>
                {/if}

                <div class="row">
                    <div class="left">
                        <button
                            class="abtn edit"
                            on:click={() => {
                                editRecord(c);
                            }}>Edit</button
                        >
                    </div>

                    <div class="right">
                        <button
                            class="abtn delete"
                            on:click={() => {
                                deleteRecord(c);
                            }}>Delete</button
                        >
                    </div>
                </div>
            </div>
        {/each}

        <div class="loadmore">
            <button
                class="loadmore abtn edit"
                on:click={loadMore}
                disabled={loadMoreDisabled}>Load More</button
            >
        </div>
    </div>
</main>

<style>
    main {
        color: #fff;
        display: flex;

        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
        flex-direction: column;
        height: calc(var(--vh, 1vh) * 100);
        position: absolute;
    }

    .loadmore {
        padding: 16px;
        font-size: 110%;
    }

    .topContainer {
        padding: 32px;
        display: flex;
    }

    .scrollable {
        width: 100vw;
        height: 100%;
        overflow-y: scroll;
    }

    .close {
        position: absolute;
        right: 0;
        font-size: 40px;
        border: none;
        background: transparent;
        color: #fff;
        margin-right: 32px;
    }

    .record {
        color: #fff;
        padding: 10px 16px;
        border-radius: 5px;
        background: #0004;

        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
        margin: 16px;

        box-shadow: 0px 0px 10px #222;
    }

    .row {
        display: flex;
    }

    .left,
    .right {
        flex: 1;
        font-size: 110%;
        margin: 5px;
    }

    .right {
        text-align: right;
    }

    .abtn {
        width: 100%;
        font-size: 107%;
        padding: 5px 8px;
        border-radius: 5px;
        color: #fff;
        border: none;
    }

    .delete {
        background: #f77;
    }

    .high {
        color: #f77;
    }

    .low {
        color: #dd7b2b;
    }

    .edit {
        background: #77f;
    }

    .edit:disabled {
        background: #0006;
        color: #999;
    }
</style>
