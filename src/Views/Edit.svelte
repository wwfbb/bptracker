<script lang="ts">
    import { Time } from "../lib/data_fetch";
    import { submitEdit } from "../lib/data_push";
    import { currentPageId, hideNavBar, Screen } from "../lib/navigation";
    import { onDestroy } from "svelte";
    let form: HTMLFormElement;

    hideNavBar.set(true);

    export let record;
    let {
        id,
        date,
        time,
        value_sys,
        value_dia,
        heart_rate,
        comment,
        user_uid,
    } = record;

    async function submitForm(event) {
        event.preventDefault();

        const formData = new FormData(form);
        if (await submitEdit(formData)) {
            alert("Edit Success");
            currentPageId.set(Screen.RAW_DATA);
        }
    }

    onDestroy(() => {
        hideNavBar.set(false);
    });
</script>

<main>
    <div class="titleContainer">
        <h1>Edit Record</h1>

        <button
            class="close"
            on:click={() => {
                currentPageId.set(Screen.RAW_DATA);
            }}
            >&#x2715;
        </button>
    </div>

    <form action="" on:submit={submitForm} bind:this={form}>
        <input type="hidden" name="id" bind:value={id} />
        <input type="hidden" name="user_uid" bind:value={user_uid} />

        <div class="row">
            <input type="date" name="date" bind:value={date} />
        </div>

        <div class="row">
            <select name="time">
                <option value={Time.MORNING} selected={Time.MORNING == time}
                    >Morning</option
                >
                <option value={Time.AFTERNOON} selected={Time.AFTERNOON == time}
                    >Afternoon</option
                >
                <!-- <option value={Time.EVENING} selected={Time.EVENING == time}
                    >Evening</option
                > -->
                <option value={Time.NIGHT} selected={Time.NIGHT == time}
                    >Night</option
                >
            </select>
        </div>

        <div class="row">
            <input
                type="text"
                placeholder="Comment..."
                name="comment"
                bind:value={comment}
            />
        </div>

        <div class="row split">
            <input
                type="number"
                name="value_sys"
                placeholder="Sys"
                bind:value={value_sys}
            />
            <input
                type="number"
                name="value_dia"
                placeholder="Dia"
                bind:value={value_dia}
            />
            <input
                type="number"
                name="heart_rate"
                placeholder="HR"
                bind:value={heart_rate}
            />
        </div>

        <div class="row">
            <input type="submit" />
        </div>
    </form>
</main>

<style>
    h1 {
        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        margin-bottom: 16px;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    }

    main {
        color: #fff;
        padding: 32px;
    }

    input[type="date"] {
        -webkit-appearance: none;
        appearance: none;
    }

    select {
        -webkit-appearance: none;
        appearance: none;
        text-align: left;
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

    .row {
        width: 100%;
        display: flex;
        margin: 8px 0px;
    }

    .row > * {
        width: 100%;
        flex: 1;
        padding: 10px 16px;
        border: 2px solid #333;
        border-radius: 5px;
        outline: none;
        font-size: 105%;
        outline: none;
        color: #333;
        background: #fff;

        font-family: "Noto Sans", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
        font-variation-settings: "wdth" 100;
    }

    .split > *:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    .split > *:nth-child(2) {
        border-right: 2px solid #333;
        border-left: 2px solid #333;
    }

    .split > *:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    input[type="submit"] {
        background: #fff4;
        color: #fff;
    }

    .titleContainer {
        display: flex;
    }
</style>
