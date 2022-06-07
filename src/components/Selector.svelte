<script>
    import { _ } from "svelte-i18n";
    import { slide } from "svelte/transition";

    import ChevronDown from "svelte-material-icons/ChevronDown.svelte";
    import ChevronUp from "svelte-material-icons/ChevronUp.svelte";

    import Checkbox from "./Checkbox.svelte";
    import Row from "./Row.svelte";
    import { clickOutside } from "../clickOutside.js";

    let visible = false;

    export let options = ["opt1", "opt2", "opt3"];
    export let selected = null;
    export let label = null;

    const select = (e, option) => {
        selected = option;
        visible = false;

        event.stopPropagation();
    }
</script>

<div class="button" on:click={() => visible = true}>
    {(selected === null || selected === undefined) ? $_("unspecified") : selected}

    <div class="icon"><ChevronDown/></div>

    {#if visible}
        <div class="menu" transition:slide={{ duration: 200 }} use:clickOutside on:clickOutside={() => visible = false}>
            <div class="option" on:click={(e) => select(e, null)}>
                {$_("unspecified")}
                <div class="icon"><ChevronUp/></div>
            </div>

            {#each options as option, i}
                <div class="option" on:click={(e) => select(e, option)}>
                    {option}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .button {
        position: relative;
        width: 100%;
        outline: none;
        background: #570B7C;
        border-radius: 6px;
        padding: 8px 16px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
    }

    .menu {
        z-index: 100;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        border-radius: 6px;
        background: #570B7C;
        box-shadow: 0 4px 10px rgba(0 0 0 / 20%);
    }

    .option {
        padding: 8px 16px;
        transition: background-color 500ms ease;
        cursor: pointer;
    }

    .option:hover {
        background: rgba(255 255 255 / 10%);
        transition: background-color 150ms ease;
    }

    .icon {
        position: absolute;
        top: 7px;
        right: 10px;
        font-size: 20px;
    }
</style>
