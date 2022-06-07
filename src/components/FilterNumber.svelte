<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";

    import Label from "./Label.svelte";
    import ValidatedInput from "./ValidatedInput.svelte";
    import Spacer from "./Spacer.svelte";
    import Row from "./Row.svelte";
    import Button from "./Button.svelte";

    export let state;
    let ranges = state.ranges || [];

    export function cancel() {
        ranges = [];
        submit();
    }

    const dispatch = createEventDispatcher();

    export function submit() {
        state.active = ranges.length > 0;
        state.ranges = ranges;
        state.predicate = (val) => {
            if (ranges.length == 0) return true;

            for (let range of ranges) {
                if (range.length == 1 && val == range[0]) return true;
                if (val >= range[0] && val <= range[1]) return true;
            }

            return false;
        };

        dispatch("submit");
    }

    function fromRaw(str) {
        return str.split(",").map((part) => {
            part = part.trim();
            let range = part.split(":").map((s) => Number(s));
            if (range.length < 1 || range.length > 2) throw new Error();
            for (let num of range) if (isNaN(num)) throw new Error();
            return range;
        });
    }

    function intoRaw(ranges) {
        return ranges.map((range) => range.join("-")).join(", ");
    }
</script>

<ValidatedInput required={false} bind:value={ranges} {fromRaw} {intoRaw} label={$_("filter")} placeholder={$_("filter.number.placeholder")}/>
<Spacer height=8/>
<Row>
    <Button on:click={cancel} transparent>{$_("clear")}</Button>
    <Button on:click={submit} type="submit">{$_("save")}</Button>
</Row>
