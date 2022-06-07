<script>
    import SortButton from "./SortButton.svelte";
    import FilterButton from "./FilterButton.svelte";
    import Spacer from "./Spacer.svelte";

    export let label;
    export let sortActive = false;
    export let filter = {};
    export let filterKind;
</script>

<div class="col">
    <div class="icon"><SortButton active={sortActive} on:sortChange/></div>
    <div class="label">{label}</div>
    <Spacer stretch=1/>
    <div class="icon"><FilterButton kind={filterKind} bind:state={filter} on:filterChange/></div>
</div>

<style>
    .col {
        display: flex;
        flex-flow: row nowrap;
        gap: 8px;
        width: 100%;
        text-align: left;
        align-items: center;
    }
</style>
