<script>
    import EyeOutline from "svelte-material-icons/EyeOutline.svelte";
    import EyeOffOutline from "svelte-material-icons/EyeOffOutline.svelte";

    import Ripples from "./Ripples.svelte";

    export let value;
    export let required = true;
    export let placeholder;
    export let password = false;
    export let integer = false;

    let type = password ? "password" : "text";
    let focused = false;
    let ripples;
    let input;
    
    let lastRipple = 0;

    const handleInput = e => {
        const str = e.target.value;

        if (str != "" && integer) {
            if (isNaN(str) || isNaN(parseInt(str))) {
                input.value = value;
                return;
            }
        }

        value = str;
    };

    const handleMousedown = e => {
        lastRipple = performance.now();
        ripples.addRipple(e);
    };

    const handleFocus = e => {
        if (focused) return;
        focused = true;
        if ((performance.now() - lastRipple) > 500) {
            ripples.addRipple(e);
            lastRipple = performance.now();
        }
    };

    const handleBlur = e => {
        focused = false;
    }

    const togglePassword = e => {
        type = type == "password" ? "text" : "password";
    };
</script>

<div class="container" class:focus={focused}>
    <Ripples bind:this={ripples}/>
    <input {value} {type} spellcheck=false {required} {placeholder} bind:this={input} on:input={handleInput}
        on:mousedown={handleMousedown} on:focus={handleFocus} on:blur={handleBlur}>

    {#if password}
        <button type="button" tabindex=-1 class="hide" on:click={togglePassword}
            on:focus={handleFocus} on:blur={handleBlur}>
            {#if type == "password"}
                <EyeOutline/>
            {:else}
                <EyeOffOutline/>
            {/if}
        </button>
    {/if}
</div>

<style>
    .container {
        position: relative;
        overflow: hidden;
        background: #570B7C;
        padding: 2px;
        margin: 4px 0;
        border-radius: 6px;
        transition: background-color 1s ease;
        cursor: text;
    }

    .container.focus {
        background: #8447A2;
        transition: background-color 200ms ease;
    }


    .container:hover {
        background: #671b8c;
        transition: background-color 200ms ease;
    }

    .container.focus:hover {
        background: #8447A2;
    }

    input {
        position: relative;
        width: 100%;
        background: #330449;
        outline: none;
        border: none;
        border-radius: 4px;
        padding: 6px 14px;
        font-size: 14px;
        font-family: "Open Sans", sans-serif;
        color: #fff;
    }

    input::placeholder {
        color: rgba(255, 255, 255, 0.3);
    }

    .hide {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 9px;
        padding: 0;
        background: none;
        outline: none;
        border: none;
        color: rgba(255, 255, 255, 0.5);
        font-size: 18px;
    }
</style>
