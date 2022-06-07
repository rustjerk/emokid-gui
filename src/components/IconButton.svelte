<script>
    import Ripples from "./Ripples.svelte";

    let ripples;
</script>

<button type="button" on:click
    on:click={ripples.addRipple}>
    <Ripples bind:this={ripples}/>
    <slot></slot>
</button>

<style>
    button {
        display: flex;
        justify-content: center;
        align-items: center;

        position: relative;
        overflow: hidden;

        cursor: pointer;

        outline: none;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        min-height: 30px;
        padding: 0;

        color: rgba(255, 255, 255, 0.5);
        background: transparent;
        transition: background-color 500ms ease;
    }

    button:hover, button:focus {
        background: rgba(255, 255, 255, 0.15);
        transition: background-color 200ms ease;
    }
</style>
