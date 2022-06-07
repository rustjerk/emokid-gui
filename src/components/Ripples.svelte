<script>
    export let borderRadius = "0px";

    let ripples = [];
    let div;

    let hasTimeout = false;

    export function addRipple(e) {
        const rect = div.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripples = [...ripples, {x, y, time: performance.now()}];

        const checkRipples = () => {
            const now = performance.now();
            if (ripples.length > 0 
                && ripples[ripples.length - 1].time + 1000 < now)
            {
                ripples = [];
                hasTimeout = false;
            } else {
                setTimeout(checkRipples, 1000)
                hasTimeout = true;
            }
        };

        if (!hasTimeout) {
            setTimeout(checkRipples, 1000)
            hasTimeout = true;
        }
    }

</script>

<div class="ripples" bind:this={div} style="border-radius: {borderRadius}">
    {#each ripples as r}
        <div class="ripple" style="left: {r.x}px; top: {r.y}px;"></div>
    {/each}
</div>

<style>
    .ripples {
        position: absolute;
        overflow: hidden;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }

    .ripple {
        position: absolute;
        aspect-ratio: 1;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);

        animation-duration: 400ms;
        animation-name: ripple;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
    }

    @keyframes ripple {
        0% {
            width: 0px;
            opacity: 0;
        }

        10% {
            opacity: 1;
        }

        100% {
            width: 200%;
            opacity: 0;
        }
    }
</style>
