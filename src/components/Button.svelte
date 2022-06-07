<script>
    import { createEventDispatcher } from "svelte";

    import Ripples from "./Ripples.svelte";

    export let transparent = false;
    export let stretch = false;
    export let type = "button";

    let ripples;
</script>

<button class:transparent type={type} on:click
    on:click={ripples.addRipple} class:stretch>
    <Ripples bind:this={ripples}/>
    <slot></slot>
</button>

<style>
    button {
        position: relative;
        overflow: hidden;

        cursor: pointer;

        padding: 6px 20px;
        gap: 10px;

        background: #A02494;
        color: #fff;
        border: none;
        border-radius: 6px;
        outline: none;

        font-family: "Open Sans", sans-serif;
        font-size: 14px;
        font-weight: 600;

        transition: box-shadow 1s ease, background-color 1s ease;
        border: 1px solid transparent;
    }

    button.stretch {
        flex: 1 1 0px;
    }

    button.transparent {
        background: none;
    }

    button.transparent:hover, button.transparent:focus {
        box-shadow: none;
        background: rgba(255, 255, 255, 0.15);
    }

    button:hover, button:focus {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
        background: #ca4bba;
        transition: box-shadow 200ms ease, background-color 200ms ease;
    }
</style>
