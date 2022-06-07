<script>
    export let checked = false;
    export let transparent = false;
    export let label = "";

    import Check from "svelte-material-icons/Check.svelte";
    import Ripples from "./Ripples.svelte";

    let ripples;
    let focused = false;
</script>

<label>
    <input bind:checked type="checkbox" on:input on:click={(e) => { ripples.addRipple(e); e.stopPropagation() }}
        on:focus={() => focused = true} on:blur={() => focused = false}>
    <div class="checkbox" class:checked class:transparent class:focused class:empty={label.length == 0}>
        <Ripples bind:this={ripples} borderRadius="4px"/>
        <div class="inner">
            <div class="icon" class:checked><Check/></div>
        </div>
    </div>
    {#if label.length > 0}
        <span>{label}</span>
    {/if}
</label>

<style>
    label {
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
        cursor: pointer;
        user-select: none;
    }

    span {
        display: block;
    }

    input {
        width: 0px;
        margin: 0;
    }

    .checkbox {
        position: relative;
        background: #570B7C;
        border-radius: 4px;
        padding: 2px;
        transition: background-color 500ms ease, opacity 500ms ease;
        margin-right: 12px;
    }

    .checkbox.empty {
        margin-right: 0;
    }

    .checkbox.focused {
        background: #8447A2;
        transition: background-color 200ms ease;
    }

    .checkbox.transparent {
        opacity: 0.4;
    }

    .checkbox.transparent.checked {
        opacity: 1;
        transition: background-color 200ms ease, opacity 200ms ease;
    }

    .inner {
        position: relative;
        display: flex;
        justify-content: center;
        width: 18px;
        height: 18px;
        border-radius: 2px;
        background: #330449;
    }

    .icon {
        opacity: 0;
        transition: opacity 100ms ease;
    }

    .icon.checked {
        opacity: 1;
    }
</style>
