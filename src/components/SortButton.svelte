<script>
    import { createEventDispatcher } from "svelte";

    import Sort from "svelte-material-icons/Sort.svelte";
    import SortAscending from "svelte-material-icons/SortAscending.svelte";
    import SortDescending from "svelte-material-icons/SortDescending.svelte";

    export let active = false;
    export let ascending = true;

    const dispatch = createEventDispatcher();

    function toggle() {
        if (active) {
            ascending = !ascending;
        } else {
            active = true;
            ascending = true;
        }

        dispatch("sortChange", ascending);
    }
</script>

<div class:active on:click={toggle}>
    {#if !active}
        <Sort/>
    {:else if ascending}
        <SortAscending/>
    {:else}
        <SortDescending/>
    {/if}
</div>

<style>
    div {
        position: relative;
        z-index: 00;
        font-size: 16px;
        color: rgb(255 255 255 / 20%);
        cursor: pointer;
        transform: translate(0, 3px);
    }

    div.active {
        color: rgb(255 255 255 / 80%);
    }
</style>
