<script>
    import { currentPageId, hideNavBar, Screen } from "./lib/navigation";
    function setScreen(newPageId) {
        return () => {
            currentPageId.set(newPageId);
        };
    }
</script>

{#if !$hideNavBar}
    <main>
        <button
            class={$currentPageId == Screen.HOME_SCREEN ? "selected" : ""}
            on:click={setScreen(Screen.HOME_SCREEN)}
        >
            <!-- <div class="icon"> -->
            <!-- <Icon icon={faChartLine} /> -->
            <!-- </div> -->
            <span> Home </span>
        </button>

        <button
            class={$currentPageId == Screen.ADD_RECORD ? "selected" : ""}
            on:click={setScreen(Screen.ADD_RECORD)}
        >
            <span> Add </span>
        </button>

        <button
            class={$currentPageId == Screen.SYNC_DETAILS ? "selected" : ""}
            on:click={setScreen(Screen.SYNC_DETAILS)}
        >
            <span> Sync </span>
        </button>
    </main>
{/if}

<style>
    main {
        background: #0002;
        flex: 1;
        display: flex;
    }

    button {
        flex: 1;
        padding: 16px 10px;
        padding-bottom: 32px;
        font-size: 100%;
        color: #fff;
        background: none;
        border: none;
        font-size: 115%;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .selected {
        background: #fff1;
    }
</style>
