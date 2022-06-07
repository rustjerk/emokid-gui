<script>
    import { _ } from "svelte-i18n";

    import Spacer from "./Spacer.svelte";
    import Row from "./Row.svelte";
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import Label from "./Label.svelte";
    import ValidatedInput from "./ValidatedInput.svelte";
    import Dialog from "./Dialog.svelte";
    import Selector from "./Selector.svelte";
    import Form from "./Form.svelte";
    import Spoiler from "./Spoiler.svelte";

    import { musicBands } from "../api.js";
    import genres from "../genres.js";

    let dialog;

    export let isEdit = false;

    export let id = 0;

    export const defaultBand = {
        name: null,
        coordX: null,
        coordY: null,
        np: null,
        description: null,
        genre: null,
        studioName: null,
        studioAddress: null,
    };

    export let band = defaultBand;

    export const show = () => {
        dialog.show();
    };

    export const hide = () => dialog.hide();

    function add() {
        if (isEdit) {
            musicBands.update(id, band);
        } else {
            musicBands.add(band);
        }

        hide();
    }

    function removeLower() {
        musicBands.removeLower(band);
        hide();
    }

    function removeGreater() {
        musicBands.removeGreater(band);
        hide();
    }

    function addIfMax() {
        musicBands.addIfMax(band);
        hide();
    }

    function remove() {
        musicBands.remove(id);
        hide();
    }

    function convertCoordX(str) {
        let num = Number(str);
        if (isNaN(num)) throw Error("NaN");
        if (num > 41) throw Error("too big");
        return num;
    }

    function convertCoordY(str) {
        let num = parseInt(str);
        if (isNaN(num)) throw Error("NaN");
        if (num != str) throw Error("trailing characters");
        if (num > 107) throw Error("too big");
        return num;
    }

    function convertNP(str) {
        let num = parseInt(str);
        if (isNaN(num)) throw Error("NaN");
        if (num != str) throw Error("trailing characters");
        if (num < 1) throw Error("too small");
        return num;
    }
</script>

<Dialog bind:this={dialog} title={$_(isEdit ? "edit_band" : "add_band")}>
    <Form on:submit={add}>
        <ValidatedInput bind:value={band.name} label={$_("field.name")} placeholder={$_("field.name.placeholder")}/>

        <Row gap=10>
            <ValidatedInput bind:value={band.coordX} label={$_("field.coordX.long")} placeholder={$_("field.coordX.placeholder")}
                fromRaw={convertCoordX}/>

            <ValidatedInput bind:value={band.coordY} label={$_("field.coordY.long")} placeholder={$_("field.coordY.placeholder")}
                fromRaw={convertCoordY}/>
        </Row>

        <ValidatedInput bind:value={band.np} label={$_("field.np.long")} placeholder={$_("field.np.placeholder")} fromRaw={convertNP}/>

        <ValidatedInput bind:value={band.description} label={$_("field.description")} placeholder={$_("field.description.placeholder")}/>

        <Label text={$_("field.genre")}>
            <Selector bind:selected={band.genre} options={genres.map(g => $_("genre." + g))}/>
        </Label>

        <ValidatedInput bind:value={band.studioName} required={false} label={$_("field.studioName")} placeholder={$_("field.studioName.placeholder")}/>

        <ValidatedInput bind:value={band.studioAddress} required={false} label={$_("field.studioAddress")} placeholder={$_("field.studioAddress.placeholder")}/>

        <Spoiler label={$_("additional_actions")}>
            <Spacer height=8/>
            <Row gap=8>
                <Button stretch on:click={removeLower}>{$_("remove_lower")}</Button>
                <Button stretch on:click={removeGreater}>{$_("remove_greater")}</Button>
            </Row>
            <Spacer height=8/>
            <Row gap=8>
                <Button stretch on:click={addIfMax}>{$_("add_if_max")}</Button>
                {#if isEdit}
                    <Button stretch on:click={remove}>{$_("remove")}</Button>
                {/if}
            </Row>
        </Spoiler>

        <Spacer height=8/>

        <Row>
            <Button transparent on:click={hide}>{$_("cancel")}</Button>
            <Button type="submit">{$_("save")}</Button>
        </Row>
    </Form>
</Dialog>
