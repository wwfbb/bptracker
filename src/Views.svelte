<script>
    import Home from "./Views/Home.svelte";
    import Add from "./Views/Add.svelte";
    import Sync from "./Views/Sync.svelte";
    import { currentPageId, Screen, recordToEdit } from "./lib/navigation";
    import RawData from "./Views/RawData.svelte";
    import Edit from "./Views/Edit.svelte";
</script>

<main>
    {#if $currentPageId == Screen.HOME_SCREEN}
        <Home />
    {:else if $currentPageId == Screen.ADD_RECORD}
        <Add />
    {:else if $currentPageId == Screen.SYNC_DETAILS}
        <Sync />
    {:else if $currentPageId == Screen.RAW_DATA}
        <RawData />
    {:else if $currentPageId == Screen.EDIT_RECORD}
        <Edit record={$recordToEdit} />
    {/if}
</main>

<style>
    main {
        flex: 11;
        overflow: scroll;
    }
</style>
