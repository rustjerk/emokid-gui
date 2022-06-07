<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import Portal from "svelte-portal";

    import Triangle from "svelte-material-icons/Triangle.svelte";

    import ModalBackground from "./ModalBackground.svelte";
    import { clickOutside } from "../clickOutside.js";

    export let popperContent;
    export let popperOpts = {};
    export let visible = true;
    export let transparent = false;
    export let bottom = false;

    const dispatch = createEventDispatcher();

    function handleClickOutside() {
        dispatch("close");
    }
</script>

{#if visible}
    <Portal target="#modals">
        <div class="popup" transition:fade={{ duration: 400, easing: quintOut }}  use:popperContent={popperOpts} use:clickOutside on:clickOutside={handleClickOutside}>
            <div class="arrow" class:top={!bottom} class:bottom data-popper-arrow>
                <div class="arrow-icon" class:top={!bottom} class:bottom><Triangle/></div>
            </div>

            <slot></slot>
        </div>

        {#if !transparent}
            <ModalBackground/>
        {/if}
    </Portal>
{/if}

<style>
    .popup {
        position: relative;
        z-index: 999;
        background: rgb(15 8 19 / 40%);
        border: 2px solid #520A75;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(16px);
        border-radius: 6px;
        width: 300px;
    }

    .arrow {
        color: #520A75;
    }

    .arrow.top {
        top: -14px;
    }

    .arrow.bottom {
        bottom: -15px;
    }

    .arrow-icon.bottom {
        transform: rotate(180deg);
    }
</style>
