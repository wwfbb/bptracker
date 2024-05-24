<script lang="ts">
    import { DateTime } from "luxon";
    import { Time } from "../lib/data_fetch";
    import { submitData } from "../lib/data_push";
    import { currentUserUUID } from "../lib/supaclient";

    let form: HTMLFormElement;
    let forceReRender = true;

    function getDefaultDate() {
        let now = DateTime.now();
        return now.toISODate();
    }

    async function submitForm(event) {
        event.preventDefault();

        const formData = new FormData(form);
        if (await submitData(formData)) {
            alert("Success!");
            forceReRender = !forceReRender;
        }

        /* Hack to rerender the form to reset to defaults*/
    }
</script>

<main>
    {#key forceReRender}
        <h1>Add Record</h1>

        <form action="" on:submit={submitForm} bind:this={form}>
            <input type="hidden" name="user_uid" value={$currentUserUUID} />

            <div class="row">
                <input type="date" name="date" value={getDefaultDate()} />
            </div>

            <div class="row">
                <select name="time">
                    <option value={Time.MORNING}>Morning</option>
                    <option value={Time.AFTERNOON}>Afternoon</option>
                    <option value={Time.EVENING}>Evening</option>
                    <option value={Time.NIGHT}>Night</option>
                </select>
            </div>

            <div class="row">
                <input type="text" placeholder="Comment..." name="comment" />
            </div>

            <div class="row split">
                <input type="number" name="value_sys" placeholder="Sys" />
                <input type="number" name="value_dia" placeholder="Dia" />
                <input type="number" name="heart_rate" placeholder="HR" />
            </div>

            <div class="row">
                <input type="submit" />
            </div>
        </form>
    {/key}
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
</style>
