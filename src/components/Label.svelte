<script>
    import { fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    export let text;
    export let error = "";
</script>

<div class="label">
    <div class="row">
        <div class="label">{text}</div>
        {#if error != ""}
            <div class="error" transition:fade={{ duration: 400, easing: quintOut }}>{error}</div>
        {/if}
    </div>
    <slot></slot>
</div>

<style>
    .label {
        display: block;
    }

    .row {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-bottom: 4px;
    }

    .error {
        font-size: 12px;
        color: #c72980;
    }
</style>
