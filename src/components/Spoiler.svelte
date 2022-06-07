<script>
    import { slide } from "svelte/transition";

    import ChevronDown from "svelte-material-icons/ChevronDown.svelte";

    export let label = "Spoiler";

    let open = false;
</script>

<div class="container">
    <div class="row" on:click={() => open = !open}>
        <div class="label">{label}</div>
        <div class="icon" class:open><ChevronDown/></div>
    </div>

    {#if open}
        <div transition:slide class="contents">
            <slot></slot>
        </div>
    {/if}
</div>

<style>
    .row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        cursor: pointer;
        margin-top: 8px;
    }

    .icon {
        transform: translate(0, 2px);
        transition: transform 300ms ease;
        margin: 0 8px;
    }

    .icon.open {
        transform: translate(0, 2px) translate(0, -2px) rotate(180deg) translate(0, 2px);
    }

    .contents {
        box-shadow: 0 -2px #520A75;
        padding-top: 4px;
        margin: 8px 0;
    }
</style>
