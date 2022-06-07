<script>
    import { onMount, onDestroy } from "svelte";
    import chroma from "chroma-js";

    import AppPage from "../components/AppPage.svelte";
    import AddDialog from "../components/AddDialog.svelte";

    import { musicBands, username } from "../api.js";

    let canvas;
    let addDialog;
    let addDialogBand;
    let addDialogID;
    let ctx;

    let drawing = false;

    let offsetX = 0;
    let offsetY = 0;
    let gridSize = 100;

    let mouseX = 0;
    let mouseY = 0;

    let overlaps = {};
    let colors = {};
    let bands = {};
    let stackOffset = 0;

    let selected = null;

    function updateBands(raw) {
        bands = raw.map((band) => {return { time: 0, band }});
    }

    $: updateBands($musicBands);

    function findOverlaps(bands) {
        for (let i = 0; i < bands.length; i++) {
            overlaps[i] = new Set();
        }

        for (let i = 0; i < bands.length; i++) {
            for (let j = 0; j < bands.length; j++) {
                if (i == j) continue;

                let a = bands[i];
                let b = bands[j];
                if (Math.pow(a.coordX - b.coordX, 2) + Math.pow(a.coordY - b.coordY, 2) < 0.2) {
                    overlaps[i].add(j);
                }
            }
        }
    }

    $: findOverlaps($musicBands);

    function generateColors(bands) {
        colors = {};
        
        for (let band of bands) {
            colors[band.owner] = [];
        }

        let keys = Object.keys(colors);
        let palette = chroma.scale(["#b650e6", "#50c9e6", "#65e650", "#e6a550", "#e65050"])
            .mode("lab").correctLightness().colors(keys.length);
        for (let i = 0; i < keys.length; i++) {
            colors[keys[i]] = palette[i];
        }
    }

    $: generateColors($musicBands);

    function clearCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;

        ctx.fillStyle = "#330449";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#2b033e";
        ctx.lineWidth = 2;
    }

    function drawGrid() {
        ctx.beginPath();

        let sy = offsetY % gridSize;
        while (sy < canvas.height) {
            ctx.moveTo(0, sy);
            ctx.lineTo(canvas.width, sy);
            sy += gridSize; 
        }

        let sx = offsetX % gridSize;
        while (sx < canvas.width) {
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, canvas.height);
            sx += gridSize; 
        }

        ctx.stroke();
    }

    function drawStack(stack) {
        let maxSize = 9999;

        let rot = stackOffset - stack.length * Math.floor(stackOffset / stack.length);
        stack.push.apply(stack, stack.splice(0, rot));

        let time = stack[0].time;
        let alpha = (Math.sin(time * 6.0) * 0.5 + 0.5) * 0.5 + 0.5;

        let head = stack[0].band;
        let posX = head.coordX * gridSize + offsetX - gridSize / 2;
        let posY = head.coordY * gridSize + offsetY - gridSize / 2;

        let maxPosX = posX;
        let maxPosY = posY;

        let parallaxX = (posX - canvas.width / 2) / canvas.width * gridSize / 10;
        let parallaxY = (posY - canvas.height / 2) / canvas.height * gridSize / 10;

        for (let j = 0; j < stack.length  && j < maxSize; j++) {
            let band = stack[j].band;

            ctx.fillStyle = chroma(colors[band.owner]).darken(1.2).alpha(alpha);
            ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
            ctx.shadowBlur = 6;

            maxPosX = posX + j * parallaxX
            maxPosY = posY + j * parallaxY;

            ctx.beginPath();
            ctx.arc(maxPosX, maxPosY, gridSize / 4, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = chroma(colors[band.owner]).alpha(alpha);
            ctx.shadowBlur = 0;

            ctx.beginPath();
            ctx.arc(maxPosX, maxPosY, gridSize / 4 - 4, 0, 2 * Math.PI);
            ctx.fill();
        }

        ctx.font = "600 14px Open Sans";
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(rot + 1, maxPosX, maxPosY);

        if (Math.pow(mouseX - maxPosX, 2) + Math.pow(mouseY - maxPosY, 2) < Math.pow(gridSize / 4, 2)) {
            selected = stack[Math.min(maxSize, stack.length) - 1].band;
        }
    }

    function drawBands(dt) {
        selected = null;

        for (let band of bands) {
            band.time += dt;
        }

        let drawn = new Set();
        let stacks = [];

        for (let i = 0; i < bands.length; i++) {
            if (drawn.has(i)) continue;

            let stack = [bands[i]];

            for (let j of overlaps[i]) {
                drawn.add(j);
                stack.push(bands[j]);
            }

            stacks.push(stack);
        }

        stacks.sort((a, b) => a.length - b.length);

        for (let stack of stacks) {
            drawStack(stack);
        }
    }

    let prevTime = 0;
    function frame(time) {
        if (canvas == null) return;

        let dt = time - prevTime;
        prevTime = time;

        clearCanvas();
        drawGrid();
        drawBands(dt / 1000);

        if (drawing) {
            requestAnimationFrame(frame);
        }
    }
    
    onMount(() => {
        drawing = true;
        ctx = canvas.getContext("2d");
        requestAnimationFrame(frame);
    });

    onDestroy(() => {
        drawing = false;
        cancelAnimationFrame(frame);
    });

    function onWheel(e) {
        stackOffset += Math.sign(e.deltaY);
    }

    let dragPosX;
    let dragPosY;

    let dragStartX;
    let dragStartY;

    let dragging = false;

    function onDragStart(e) {
        dragPosX = e.clientX; 
        dragPosY = e.clientY; 

        dragStartX = offsetX;
        dragStartY = offsetY;

        dragging = true;
    }

    function onDrag(e) {
        if (dragging) {
            offsetX = dragStartX - dragPosX + e.clientX;
            offsetY = dragStartY - dragPosY + e.clientY;
        }

        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function onDragEnd(e) {
        dragging = false;
    }

    function onClick(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (selected) {
            addDialogBand = Object.assign({}, selected);
            addDialogID = addDialogBand.id;
            addDialog.show();
        }
    }
</script>

<AppPage>
    <div class="container">
        <canvas class:pointer={selected != null} on:click={onClick} on:wheel={onWheel} on:mousedown={onDragStart} on:mouseup={onDragEnd} on:mousemove={onDrag} bind:this={canvas}></canvas>
    </div>
</AppPage>

<AddDialog bind:this={addDialog} band={addDialogBand} isEdit={true} id={addDialogID}/>

<style>
    .container {
        width: 100%;
        height: 100%;
    }

    .pointer {
        cursor: pointer;
    }
</style>
