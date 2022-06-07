<script context="module">
    import { writable } from 'svelte/store';

    export const alerts = writable([]);
</script>

<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";

    import { fade } from "svelte/transition";
    import { quintOut } from "svelte/easing";

    import ModalBackground from "./ModalBackground.svelte";
    import Spoiler from "./Spoiler.svelte";
    import Row from "./Row.svelte";
    import Spacer from "./Spacer.svelte";
    import Button from "./Button.svelte";

    export let visible = true;
    export let title = "Alert";

    const dispatch = createEventDispatcher();

    function close() {
        if (!visible) return;
        visible = false;

        setTimeout(() => {
            dispatch("close");
        }, 600);
    }
</script>

{#if visible}
    <ModalBackground on:click={close} zIndex=200/>

    <div class="dialog" transition:fade={{ duration: 500, easing: quintOut }}>
        <h1>{title}</h1>
        <Spacer height=8/>
        <slot name="short"></slot>
        <Spacer height=8/>
        <Spoiler label={$_("details")}>
            <slot name="details"></slot>
        </Spoiler>
        <Spacer height=16/>
        <Row>
            <Spacer/>
            <Button on:click={close}>{$_("ok")}</Button>
        </Row>
    </div>
{/if}

<style>
    .dialog {
        position: fixed;
        top: 50%;
        left: 36px;
        right: 36px;
        transform: translate(0, -50%);
        padding: 16px;
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
