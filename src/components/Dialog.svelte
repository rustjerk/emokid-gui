<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    import ModalBackground from "./ModalBackground.svelte";
    import Spacer from "./Spacer.svelte";
    import { clickOutside } from "../clickOutside.js";

    export let title;

    let visible = false;

    export function show() {
        visible = true;
    }

    export function hide() {
        visible = false;
    }
</script>

{#if visible}
    <ModalBackground zIndex=200/>

    <div class="dialog" use:clickOutside on:clickOutside={hide} transition:fade={{ duration: 500, easing: quintOut }}>
        <h1>{title}</h1>
        <Spacer height=8/>
        <slot></slot>
    </div>
{/if}

<style>
    .dialog {
        position: fixed;
        top: 50%;
        left: 36px;
        right: 36px;
        transform: translate(0, -50%);
        padding: 24px;
        z-index: 300;
        background: #280438;
        border: 2px solid #520A75;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        border-radius: 6px;
        max-width: 400px;
        margin: 0 auto;
    }

    h1 {
        margin: 0;
        font-size: 24px;
        text-align: center;
    }
</style>
